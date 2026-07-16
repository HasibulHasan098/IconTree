import { readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, '..', '..', 'public', 'icons');
const OUTPUT_FILE = join(__dirname, 'manifest.json');

const CATEGORY_MAP = {
  'arrow': 'navigation',
  'arrows': 'navigation',
  'add': 'action',
  'delete': 'action',
  'edit': 'action',
  'save': 'action',
  'close': 'action',
  'menu': 'navigation',
  'setting': 'settings',
  'user': 'user',
  'profile': 'user',
  'search': 'action',
  'home': 'navigation',
  'login': 'authentication',
  'logout': 'authentication',
  'security': 'security',
  'notification': 'notification',
  'message': 'communication',
  'chat': 'communication',
  'call': 'communication',
  'mail': 'communication',
  'folder': 'file',
  'file': 'file',
  'document': 'file',
  'image': 'media',
  'video': 'media',
  'music': 'media',
  'play': 'media',
  'pause': 'media',
  'calendar': 'calendar',
  'time': 'time',
  'clock': 'time',
  'chart': 'data',
  'graph': 'data',
  'analytics': 'data',
  'wallet': 'finance',
  'bank': 'finance',
  'coin': 'finance',
  'shop': 'commerce',
  'cart': 'commerce',
  'bag': 'commerce',
  'heart': 'emoji',
  'star': 'emoji',
  'like': 'emoji',
  'emoji': 'emoji',
  'weather': 'weather',
  'sun': 'weather',
  'moon': 'weather',
  'cloud': 'weather',
  'car': 'transport',
  'plane': 'transport',
  'train': 'transport',
  'bus': 'transport',
  'medical': 'health',
  'health': 'health',
  'hospital': 'health',
  'building': 'business',
  'office': 'business',
  'company': 'business',
  'crypto': 'crypto',
  'bitcoin': 'crypto',
  'ethereum': 'crypto',
  'blockchain': 'crypto',
  '3d': '3d',
  'cube': '3d',
  'rotate': '3d',
  'square': 'shape',
  'circle': 'shape',
  'triangle': 'shape',
  'book': 'file',
  'archive': 'file',
};

function deriveCategory(name) {
  const lower = name.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category;
  }
  return 'general';
}

function deriveTags(name) {
  const parts = name.toLowerCase().replace(/[()]/g, '').split('-').filter(Boolean);
  const tags = new Set();
  for (const part of parts) {
    if (part.length > 1) tags.add(part);
  }
  return Array.from(tags);
}

function generateManifest() {
  if (!existsSync(ICONS_DIR)) {
    console.error(`Icons directory not found: ${ICONS_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(ICONS_DIR).filter(f => f.endsWith('.json'));
  const icons = files.map(filename => {
    const baseName = filename.replace(/\.json$/, '');
    const cleanName = baseName.replace(/^iconsax-/, '');
    const size = statSync(join(ICONS_DIR, filename)).size;
    const slug = cleanName.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').toLowerCase();

    return {
      name: cleanName,
      slug,
      filename,
      tags: deriveTags(cleanName),
      category: deriveCategory(cleanName),
      size,
      url: `/icon/use/${slug}.json`,
    };
  });

  icons.sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    generatedAt: new Date().toISOString(),
    total: icons.length,
    icons,
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Generated manifest with ${icons.length} icons at ${OUTPUT_FILE}`);
  console.log(`Source of truth: ${ICONS_DIR}`);
}

generateManifest();
