import manifestData from './manifest.json';

export interface IconManifestEntry {
  name: string;
  slug: string;
  filename: string;
  tags: string[];
  category: string;
  size: number;
  url: string;
}

export interface IconManifest {
  generatedAt: string;
  total: number;
  icons: IconManifestEntry[];
}

const iconModules = import.meta.glob('../../icons/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;
let cachedManifest: IconManifest | null = null;

function getManifestData(): IconManifest {
  if (cachedManifest) return cachedManifest;

  const data = manifestData as Partial<IconManifest>;
  const icons = Array.isArray(data.icons) ? (data.icons as IconManifestEntry[]) : [];

  cachedManifest = {
    generatedAt: typeof data.generatedAt === 'string' ? data.generatedAt : new Date().toISOString(),
    total: typeof data.total === 'number' ? data.total : icons.length,
    icons,
  };

  return cachedManifest;
}

export function getManifest(): IconManifest {
  return getManifestData();
}

export function searchManifest(query: string, page = 1, pageSize = 50, category?: string): { total: number; results: IconManifestEntry[] } {
  const manifest = getManifest();
  const q = query.toLowerCase().trim();
  let filtered = manifest.icons;
  if (category) {
    filtered = filtered.filter(icon => icon.category === category);
  }
  if (q) {
    filtered = filtered.filter(icon =>
      icon.name.includes(q) ||
      icon.tags.some(t => t.includes(q)) ||
      icon.category.includes(q)
    );
  }
  const start = (page - 1) * pageSize;
  const results = filtered.slice(start, start + pageSize);
  return { total: filtered.length, results };
}

export function getIconBySlug(slug: string): IconManifestEntry | undefined {
  return getManifest().icons.find(i => i.slug === slug);
}
