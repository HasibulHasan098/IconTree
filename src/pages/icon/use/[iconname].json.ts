import type { APIRoute } from 'astro';
import { getIconBySlug } from '../../../lib/manifest';
import { readIconFile } from '../../../lib/icon-data';

export const GET: APIRoute = async ({ params }) => {
  const slug = params.iconname ?? '';
  const entry = getIconBySlug(slug);

  if (!entry) {
    return new Response(JSON.stringify({ error: 'icon not found', name: slug }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = readIconFile(slug);
  if (!data) {
    return new Response(JSON.stringify({ error: 'icon file missing', name: slug }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
};
