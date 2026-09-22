// server/routes/sitemapRoute.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const BlogPost = require('../models/BlogPost'); // adapte le nom exact
const Category = require('../models/Category'); // adapte le nom exact

router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' }).select('_id createdAt');
    
    let blogPosts = [];
    let categories = [];
    
    try {
      blogPosts = await BlogPost.find({ status: 'published' }).select('_id createdAt');
    } catch (e) {
      console.log('Blog model not found or error:', e.message);
    }
    
    try {
      categories = await Category.find().select('slug');
    } catch (e) {
      console.log('Category model not found or error:', e.message);
    }

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

    const categoryUrls = categories.map(c => ({
      loc: `https://peptidesweight-loss.com/marketplace/${c.slug}`,
      priority: '0.7',
      changefreq: 'weekly'
    }));

    const allUrls = [...staticUrls, ...productUrls, ...blogUrls, ...categoryUrls];

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