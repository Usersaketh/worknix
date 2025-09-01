import { writeFile } from 'fs/promises';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Dynamically import job fetching (ESM/TS compiled context). If it fails, continue with static routes.
let jobIds = [];
try {
  const jobsMod = await import('../dist/server-jobs.cjs').catch(()=>null);
  if (jobsMod && typeof jobsMod.fetchJobIds === 'function') {
    jobIds = await jobsMod.fetchJobIds();
  }
} catch (e) {
  console.warn('Sitemap: dynamic job fetch failed, continuing static only:', e?.message || e);
}

const baseUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://example.com';
// Static routes; dynamic job detail URLs can be appended if you export a list at build time.
const today = new Date().toISOString().split('T')[0];
// In future we could map jobIds to their postedAt dates; for now use today for dynamic entries.
const routes = ['/', '/jobs/private', '/jobs/govt', '/about', '/contact', '/privacy', '/terms', '/news', ...jobIds.map(id => `/jobs/${id}`)];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
  routes.map(r => `\n  <url><loc>${baseUrl}${r}</loc><lastmod>${today}</lastmod><changefreq>hourly</changefreq><priority>${r==='/'?1.0:0.6}</priority></url>`).join('') +
  '\n</urlset>\n';

await writeFile('./public/sitemap.xml', xml, 'utf8');
console.log('sitemap.xml written with', routes.length, 'routes');
