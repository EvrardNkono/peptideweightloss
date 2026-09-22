const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' }).select('_id createdAt');

    const staticUrls = [
      { loc: 'https://peptidesweight-loss.com/', priority: '1.0', changefreq: 'daily' },
      { loc: 'https://peptidesweight-loss.com/marketplace', priority: '0.9', changefreq: 'daily' },
      { loc: 'https://peptidesweight-loss.com/contact', priority: '0.5', changefreq: 'monthly' },
    ];

    const productUrls = products.map(p => ({
      loc: `https://peptidesweight-loss.com/product/${p._id}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : undefined
    }));

    const allUrls = [...staticUrls, ...productUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;