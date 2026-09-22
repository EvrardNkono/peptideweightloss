// server/routes/sitemapRoute.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');

// ✅ Cache en mémoire
let sitemapCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

router.get('/sitemap.xml', async (req, res) => {
  try {
    const now = Date.now();

    // ✅ Si le cache existe et n'a pas expiré, on le renvoie directement
    if (sitemapCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      res.header('Content-Type', 'application/xml');
      return res.send(sitemapCache);
    }

    // Sinon, on régénère
    const [products, blogPosts, categories] = await Promise.all([
      Product.find({ status: 'active' }).select('_id createdAt').lean(),
      BlogPost.find({ status: 'published' }).select('_id createdAt').lean(),
      Category.find({ isActive: true }).select('slug section').lean()
    ]);

    const staticUrls = [
      { loc: 'https://peptidesweight-loss.com/', priority: '1.0', changefreq: 'daily' },
      { loc: 'https://peptidesweight-loss.com/shop', priority: '0.9', changefreq: 'daily' },
      { loc: 'https://peptidesweight-loss.com/marketplace', priority: '0.9', changefreq: 'daily' },
      { loc: 'https://peptidesweight-loss.com/about', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://peptidesweight-loss.com/knowledge', priority: '0.6', changefreq: 'weekly' },
      { loc: 'https://peptidesweight-loss.com/contact', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://peptidesweight-loss.com/labs', priority: '0.6', changefreq: 'weekly' },
      { loc: 'https://peptidesweight-loss.com/blog', priority: '0.8', changefreq: 'weekly' },
    ];

    const productUrls = products.map(p => ({
      loc: `https://peptidesweight-loss.com/product/${p._id}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : undefined
    }));

    const blogUrls = blogPosts.map(b => ({
      loc: `https://peptidesweight-loss.com/blog/${b._id}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : undefined
    }));

    const peptideCategoryUrls = categories
      .filter(c => c.section === 'peptides')
      .map(c => ({
        loc: `https://peptidesweight-loss.com/shop/peptides/${c.slug}`,
        priority: '0.7',
        changefreq: 'weekly'
      }));

    const marketplaceCategoryUrls = categories
      .filter(c => c.section === 'marketplace')
      .map(c => ({
        loc: `https://peptidesweight-loss.com/marketplace/${c.slug}`,
        priority: '0.7',
        changefreq: 'weekly'
      }));

    const allUrls = [
      ...staticUrls,
      ...productUrls,
      ...blogUrls,
      ...peptideCategoryUrls,
      ...marketplaceCategoryUrls
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    // ✅ On met à jour le cache
    sitemapCache = xml;
    cacheTimestamp = now;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;