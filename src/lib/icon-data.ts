import { getIconBySlug } from './manifest';

const iconModules = import.meta.glob('../../public/icons/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.replace(/^#/, '').trim();
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
  const num = parseInt(h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function recolorLottie(data: any, hex: string): any {
  const rgb = hexToRgb(hex);
  if (!rgb) return data;

  const [r, g, b] = rgb.map((v) => v / 255);

  function walk(node: any): void {
    if (node == null || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    if (
      typeof node.ty === 'string' &&
      (node.ty === 'fl' || node.ty === 'st' || node.ty === 'gf') &&
      node.c &&
      node.c.k
    ) {
      const c = node.c;
      if (c.a === 0 && Array.isArray(c.k) && c.k.length >= 3) {
        // static color: c.k = [r, g, b, a]
        c.k[0] = r;
        c.k[1] = g;
        c.k[2] = b;
      } else if (Array.isArray(c.k)) {
        // animated color: c.k = [{ t, s: [r,g,b,a] }, ...]
        c.k.forEach((kf: any) => {
          if (kf && Array.isArray(kf.s) && kf.s.length >= 3) {
            kf.s[0] = r;
            kf.s[1] = g;
            kf.s[2] = b;
          }
        });
      }
    }

    for (const key of Object.keys(node)) {
      walk(node[key]);
    }
  }

  walk(data);
  return data;
}

export function readIconFile(slug: string, color?: string): unknown | null {
  const entry = getIconBySlug(slug);
  if (!entry) return null;

  const key = Object.keys(iconModules).find((k) => k.endsWith(`/${entry.filename}`));
  if (!key) return null;

  const data: unknown = iconModules[key] ?? null;
  if (!data || color == null) return data;

  return recolorLottie(JSON.parse(JSON.stringify(data)), color);
}
