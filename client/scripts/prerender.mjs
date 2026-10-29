// scripts/prerender.mjs
// Lancé automatiquement après `vite build`.
//
// Génère, pour chaque page importante du site, un fichier HTML qui contient déjà :
//   - <title>, meta description, canonical, Open Graph, Twitter, JSON-LD
//   - un H1, du texte, des images avec alt, et des liens internes
// Google, Ahrefs, les réseaux sociaux et les IA voient donc le contenu SANS exécuter
// de JavaScript. React remplace ensuite ce contenu au chargement (createRoot).
//
// Ce script ne fait JAMAIS échouer le build : en cas de problème (API injoignable...),
// les pages concernées ne sont pas générées et le site continue de fonctionner
// comme une SPA classique.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_IMAGE,
  STATIC_PAGES,
  getPageSeo,
  buildTitle,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_RAW,
  CONTACT_HOURS,
  CONTACT_FAQS,
  KNOWLEDGE_ITEMS,
  LAB_LIST,
  STATIC_INTRO,
  buildOrganizationSchema,
  buildFaqSchema,
} from '../src/seo/staticPages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const API_URL = (process.env.PRERENDER_API_URL || 'https://peptideweightloss.vercel.app/api').replace(/\/+$/, '');

// ---------- utilitaires ----------
const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
const truncate = (s, n) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const safeSegment = (s) => typeof s === 'string' && /^[A-Za-z0-9_-]+$/.test(s);
const absUrl = (img) => (!img ? DEFAULT_IMAGE : /^https?:\/\//.test(img) ? img : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`);
const price = (n) => (typeof n === 'number' ? `$${n.toFixed(2)}` : '');

async function fetchJson(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[prerender] ${url} (essai ${i}/${tries}) : ${err.message}`);
      if (i < tries) await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
  return null;
}

// ---------- blocs HTML communs ----------
const NAV = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/marketplace', 'Marketplace'],
  ['/blog', 'Blog'],
  ['/knowledge', 'Knowledge Center'],
  ['/labs', 'Lab Testing'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const SHELL_CSS =
  '.pr-shell{max-width:960px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#0f172a}' +
  '.pr-shell a{color:#2563eb}.pr-shell nav a{margin-right:14px}.pr-shell h1{font-size:2rem;line-height:1.2;margin:24px 0 12px}' +
  '.pr-shell h2{font-size:1.4rem;margin:28px 0 10px}.pr-shell img{max-width:320px;height:auto}.pr-shell ul{padding-left:20px}';

function layout(h1, body) {
  const nav = NAV.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join('');
  return (
    `<div class="pr-shell">` +
    `<header><nav aria-label="Main">${nav}</nav></header>` +
    `<main><h1>${esc(h1)}</h1>${body}</main>` +
    `<footer><nav aria-label="Footer">${nav}</nav><p>&copy; ${esc(SITE_NAME)}</p></footer>` +
    `</div>`
  );
}

function productLinks(list, max = Infinity) {
  const items = list
    .slice(0, max)
    .map((p) => `<li><a href="/product/${esc(p._id)}">${esc(p.name)}</a>${p.price != null ? ` – ${esc(price(p.price))}` : ''}</li>`)
    .join('');
  return items ? `<ul>${items}</ul>` : '';
}

function headTags({ title, description, canonical, image, ogType = 'website', schema, extra = '' }) {
  const tags = [
    `<title data-rh="true">${esc(title)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(description)}">`,
    `<link data-rh="true" rel="canonical" href="${esc(canonical)}">`,
    `<meta data-rh="true" property="og:type" content="${esc(ogType)}">`,
    `<meta data-rh="true" property="og:title" content="${esc(title)}">`,
    `<meta data-rh="true" property="og:description" content="${esc(description)}">`,
    `<meta data-rh="true" property="og:image" content="${esc(image)}">`,
    `<meta data-rh="true" property="og:url" content="${esc(canonical)}">`,
    `<meta data-rh="true" name="twitter:title" content="${esc(title)}">`,
    `<meta data-rh="true" name="twitter:description" content="${esc(description)}">`,
    `<meta data-rh="true" name="twitter:image" content="${esc(image)}">`,
    extra,
  ];
  if (schema) tags.push(`<script data-rh="true" type="application/ld+json">${jsonLd(schema)}</script>`);
  tags.push(`<style data-prerender>${SHELL_CSS}</style>`);
  return tags.join('\n    ');
}

// ---------- écriture des fichiers ----------
async function writePage(route, html) {
  // '/' -> dist/index.html ; '/shop' -> dist/shop.html ; '/shop/peptides' -> dist/shop/peptides.html
  // (vercel.json contient "cleanUrls": true, donc /shop sert shop.html)
  const file = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${route.replace(/^\/+/, '')}.html`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html, 'utf8');
}

// ---------- programme principal ----------
async function main() {
  let template;
  try {
    template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  } catch {
    console.warn('[prerender] dist/index.html introuvable : étape ignorée.');
    return;
  }

  // Modèle vierge conservé pour toutes les routes non pré-générées (panier, compte, nouvelles URLs...)
  // Écrit EN PREMIER : vercel.json y redirige toutes les routes inconnues.
  await fs.writeFile(path.join(DIST, 'app-shell.html'), template, 'utf8');

  if (!template.includes('<div id="root"></div>') || !template.includes('</head>')) {
    console.warn('[prerender] Structure de index.html inattendue : pages non générées (le site reste une SPA).');
    return;
  }

  const render = (head, shell) =>
    template.replace('</head>', `    ${head}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${shell}</div>`);

  // ----- données de l'API -----
  const [productsRes, postsRes, catsRes] = await Promise.all([
    fetchJson(`${API_URL}/products`),
    fetchJson(`${API_URL}/blog-posts?limit=1000`),
    fetchJson(`${API_URL}/categories`),
  ]);
  const products = (productsRes?.data || []).filter((p) => p && safeSegment(String(p._id)) && p.name);
  const posts = (postsRes?.data || []).filter((p) => p && safeSegment(String(p._id)) && p.title);
  const categories = (catsRes?.data || []).filter((c) => c && safeSegment(c.slug));
  console.log(`[prerender] API : ${products.length} produits, ${posts.length} articles, ${categories.length} catégories`);

  let count = 0;
  const done = async (route, html) => {
    await writePage(route, html);
    count++;
  };

  // ----- pages statiques -----
  for (const route of Object.keys(STATIC_PAGES)) {
    const seo = getPageSeo(route);
    const canonical = `${SITE_URL}${route === '/' ? '/' : route}`;
    let body = `<p>${esc(seo.description)}</p>`;
    for (const para of STATIC_INTRO[route] || []) body += `<p>${esc(para)}</p>`;

    if (route === '/contact') {
      body +=
        `<h2>Contact details</h2><ul>` +
        `<li>Email: <a href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a></li>` +
        `<li>Phone: <a href="tel:${esc(CONTACT_PHONE_RAW)}">${esc(CONTACT_PHONE)}</a></li>` +
        `<li>Hours: ${esc(CONTACT_HOURS)}</li></ul>` +
        `<h2>Frequently Asked Questions</h2>` +
        CONTACT_FAQS.map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join('');
    }
    if (route === '/knowledge') {
      body += `<h2>Articles</h2><ul>${KNOWLEDGE_ITEMS.map((a) => `<li><strong>${esc(a.title)}</strong><br>${esc(a.excerpt)}</li>`).join('')}</ul>`;
    }
    if (route === '/labs') {
      body += `<h2>Our laboratories</h2><ul>${LAB_LIST.map((l) => `<li><a href="/labs/${esc(l.slug)}">${esc(l.name)}</a>${l.description ? ` – ${esc(l.description)}` : ''}</li>`).join('')}</ul>`;
    }

    if (route === '/' || route === '/shop' || route === '/marketplace' || route === '/shop/peptides' || route === '/shop/blends') {
      const cats = categories
        .filter((c) => (route === '/shop/blends' ? false : true))
        .map((c) => `<li><a href="/${c.section === 'marketplace' ? 'marketplace' : 'shop/peptides'}/${esc(c.slug)}">${esc(c.name)}</a></li>`)
        .join('');
      if (cats) body += `<h2>Categories</h2><ul>${cats}</ul>`;
      const list = route === '/' ? [...products].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)).slice(0, 24) : products;
      if (list.length) body += `<h2>${route === '/' ? 'Popular products' : 'All products'}</h2>${productLinks(list)}`;
      if (route === '/' && posts.length) {
        body += `<h2>Latest articles</h2><ul>${posts
          .slice(0, 6)
          .map((p) => `<li><a href="/blog/${esc(p._id)}">${esc(p.title)}</a></li>`)
          .join('')}</ul>`;
      }
    }

    if (route === '/blog') {
      body += posts.length
        ? `<ul>${posts
            .map((p) => `<li><a href="/blog/${esc(p._id)}">${esc(p.title)}</a>${p.excerpt ? `<br>${esc(truncate(p.excerpt, 200))}` : ''}</li>`)
            .join('')}</ul>`
        : '';
    }

    const head = headTags({
      title: seo.title,
      description: seo.description,
      canonical,
      image: DEFAULT_IMAGE,
      schema:
        route === '/'
          ? [
              { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/`, description: seo.description },
              buildOrganizationSchema(),
            ]
          : route === '/contact'
            ? buildFaqSchema()
            : undefined,
    });
    await done(route, render(head, layout(seo.h1, body)));
  }

  // ----- pages catégories -----
  for (const c of categories) {
    const route = c.section === 'marketplace' ? `/marketplace/${c.slug}` : `/shop/peptides/${c.slug}`;
    const seo = getPageSeo(route);
    const mine = products.filter(
      (p) => p.category && [c.slug, c.name].filter(Boolean).some((v) => String(p.category).toLowerCase() === String(v).toLowerCase())
    );
    let body = `<p>${esc(truncate(c.description, 300) || seo.description)}</p>`;
    body += `<p>${esc(c.name || seo.h1)} products at ${esc(SITE_NAME)} are sold for research purposes only. Each product page lists the full description and price, and orders ship worldwide with tracking. Use the list below to open a product, or browse the full shop and marketplace from the main menu.</p>`;
    body += `<p>Compare the products in this category by name and price, then open a product page for its full description. For guidance on storage, solubility and reconstitution, read the Knowledge Center, and see the Lab Testing section to learn how quality is verified. If you cannot find what you need, contact our support team and we will help you choose the right product for your research.</p>`;
    body += `<h2>${esc(c.name)} products</h2>${productLinks(mine.length ? mine : products)}`;
    const head = headTags({ title: seo.title, description: seo.description, canonical: `${SITE_URL}${route}`, image: DEFAULT_IMAGE });
    await done(route, render(head, layout(c.name || seo.h1, body)));
  }

  // ----- fiches produit (mêmes valeurs que ProductDetail.jsx) -----
  for (const p of products) {
    const route = `/product/${p._id}`;
    const url = `${SITE_URL}${route}`;
    const title = buildTitle(p.name, SITE_NAME);
    const description = p.description
      ? p.description.slice(0, 155)
      : `${p.name} - Premium research peptide. ${p.purity} purity, lab-tested. Shop now at Peptides Weight Loss.`;
    const image = absUrl(p.image);
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image,
      description: p.description || `${p.name} - Premium research peptide, ${p.purity} purity.`,
      sku: String(p._id),
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'USD',
        price: p.price,
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      ...(p.reviews > 0 && { aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews } }),
    };

    const related = products.filter((x) => x._id !== p._id && x.category === p.category).slice(0, 6);
    const more = related.length ? related : products.filter((x) => x._id !== p._id).slice(0, 6);
    let body =
      `<nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/marketplace">Marketplace</a> › ${esc(p.name)}</nav>` +
      (p.image ? `<p><img src="${esc(image)}" alt="${esc(p.name)}" width="320"></p>` : '') +
      `<p><strong>${esc(price(p.price))}</strong>${p.purity ? ` · Purity: ${esc(p.purity)}` : ''} · ${p.stock > 0 ? 'In stock' : 'Out of stock'}</p>` +
      (p.description ? `<p>${esc(p.description)}</p>` : '') +
      (p.moreDetails ? `<h2>More details</h2><p>${esc(p.moreDetails)}</p>` : '') +
      `<h2>Related products</h2>${productLinks(more)}` +
      `<p><a href="/marketplace">Back to Marketplace</a></p>`;

    const head = headTags({ title, description, canonical: url, image, ogType: 'product', schema });
    await done(route, render(head, layout(p.name, body)));
  }

  // ----- articles de blog (mêmes valeurs que BlogPost.jsx) -----
  for (const post of posts) {
    const route = `/blog/${post._id}`;
    const url = `${SITE_URL}${route}`;
    const title = buildTitle(post.title, `${SITE_NAME} Blog`);
    const description = truncate(post.excerpt || post.content, 155);
    const image = absUrl(post.image);
    const published = post.createdAt || post.date || new Date().toISOString();
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      image,
      datePublished: published,
      dateModified: post.updatedAt || published,
      description,
      author: { '@type': 'Person', name: post.author || SITE_NAME },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      mainEntityOfPage: url,
    };
    const paragraphs = String(post.content || '')
      .split(/\n+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => `<p>${esc(t)}</p>`)
      .join('');
    const others = posts.filter((x) => x._id !== post._id).slice(0, 5);
    const body =
      `<nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog">Blog</a> › ${esc(post.title)}</nav>` +
      (post.author ? `<p>By ${esc(post.author)}</p>` : '') +
      (post.image ? `<p><img src="${esc(image)}" alt="${esc(post.title)}" width="320"></p>` : '') +
      (post.excerpt ? `<p><em>${esc(post.excerpt)}</em></p>` : '') +
      paragraphs +
      (others.length ? `<h2>More articles</h2><ul>${others.map((x) => `<li><a href="/blog/${esc(x._id)}">${esc(x.title)}</a></li>`).join('')}</ul>` : '') +
      `<p><a href="/blog">Back to the blog</a></p>`;

    const head = headTags({
      title,
      description,
      canonical: url,
      image,
      ogType: 'article',
      schema,
      extra: `<meta data-rh="true" property="article:published_time" content="${esc(published)}">`,
    });
    await done(route, render(head, layout(post.title, body)));
  }

  console.log(`[prerender] ${count} pages HTML générées dans dist/ (modèle vierge : dist/app-shell.html)`);
}

main().catch((err) => {
  // Ne jamais casser le déploiement à cause du SEO
  console.warn('[prerender] Erreur inattendue, étape ignorée :', err);
});
