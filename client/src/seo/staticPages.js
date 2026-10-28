// src/seo/staticPages.js
// Source unique pour les titres/descriptions SEO des pages "statiques".
// Utilisé à la fois par le script de build (scripts/prerender.mjs) et par
// DefaultSEO.jsx, afin que le HTML généré et le rendu React soient identiques.

export const SITE_URL = 'https://peptidesweight-loss.com';
export const SITE_NAME = 'Peptides Weight Loss';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export const DEFAULT_TITLE = 'Peptides for Weight Loss: Complete 2026 Guide & Comparison';
export const DEFAULT_DESCRIPTION =
  'Compare the best peptides for weight loss in 2026 — effectiveness, safety, dosage, and side effects explained. Make an informed choice with our expert guide.';

export const STATIC_PAGES = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    h1: DEFAULT_TITLE,
  },
  '/shop': {
    title: `Shop Research Peptides - ${SITE_NAME}`,
    description: 'Browse our full catalog of research peptides and blends. High purity, lab-tested products at Peptides Weight Loss.',
    h1: 'Shop Research Peptides',
  },
  '/shop/peptides': {
    title: `Research Peptides - ${SITE_NAME}`,
    description: 'Explore our range of research peptides by category. High purity and lab-tested.',
    h1: 'Research Peptides',
  },
  '/shop/blends': {
    title: `Peptide Blends - ${SITE_NAME}`,
    description: 'Discover our peptide blends for research use. High purity and lab-tested.',
    h1: 'Peptide Blends',
  },
  '/marketplace': {
    title: `Marketplace - ${SITE_NAME}`,
    description: 'Browse the full Peptides Weight Loss marketplace: research peptides, blends and more.',
    h1: 'Marketplace',
  },
  '/blog': {
    title: `Peptides Weight Loss Blog - Guides & Research News`,
    description: 'Read our latest guides, comparisons and research news about peptides for weight loss.',
    h1: 'Peptides Weight Loss Blog',
  },
  '/knowledge': {
    title: `Knowledge Center - ${SITE_NAME}`,
    description: 'Learn about peptides: how they work, safety information and research resources.',
    h1: 'Knowledge Center',
  },
  '/labs': {
    title: `Lab Testing & Quality - ${SITE_NAME}`,
    description: 'Lab testing and quality information for the peptides sold by Peptides Weight Loss.',
    h1: 'Lab Testing & Quality',
  },
  '/about': {
    title: `About Us - ${SITE_NAME}`,
    description: 'Learn more about Peptides Weight Loss, who we are and how we work.',
    h1: 'About Us',
  },
  '/contact': {
    title: `Contact Us - ${SITE_NAME}`,
    description: 'Get in touch with the Peptides Weight Loss team.',
    h1: 'Contact Us',
  },
};

// Pages à ne pas indexer (privées / transactionnelles)
const NOINDEX_PREFIXES = ['/cart', '/checkout', '/account', '/my-prescriptions', '/admin', '/prescription'];

export const normalizePath = (pathname = '/') => {
  const p = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return p === '' ? '/' : p;
};

export const isNoIndexPath = (pathname) => {
  const p = normalizePath(pathname);
  return NOINDEX_PREFIXES.some((x) => p === x || p.startsWith(`${x}/`));
};

const humanize = (slug) =>
  decodeURIComponent(slug)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Retourne { title, description, h1 } pour un chemin donné
export const getPageSeo = (pathname) => {
  const p = normalizePath(pathname);
  if (STATIC_PAGES[p]) return STATIC_PAGES[p];

  // Pages catégories : /shop/peptides/:slug, /marketplace/:slug, /shop/:slug
  const m = p.match(/^\/(?:shop\/peptides|marketplace|shop)\/([^/]+)$/);
  if (m) {
    const name = humanize(m[1]);
    return {
      title: `${name} - ${SITE_NAME}`,
      description: `Browse ${name} at Peptides Weight Loss. High purity, lab-tested research products.`,
      h1: name,
    };
  }
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, h1: DEFAULT_TITLE };
};
