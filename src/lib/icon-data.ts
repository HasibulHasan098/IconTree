import { getIconBySlug } from './manifest';

const iconModules = import.meta.glob('../../public/icons/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

export function readIconFile(slug: string): unknown | null {
  const entry = getIconBySlug(slug);
  if (!entry) return null;

  const key = Object.keys(iconModules).find((k) => k.endsWith(`/${entry.filename}`));
  if (!key) return null;

  return iconModules[key] ?? null;
}
