import type { APIRoute } from 'astro';
import { searchManifest } from '../../lib/manifest';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);
  const { total, results } = searchManifest(query, page, pageSize, category || undefined);

  return new Response(JSON.stringify({
    query,
    category,
    count: total,
    results,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
