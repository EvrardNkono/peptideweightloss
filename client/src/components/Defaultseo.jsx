// src/components/DefaultSEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  SITE_URL,
  DEFAULT_IMAGE,
  DEFAULT_DESCRIPTION,
  getPageSeo,
  isNoIndexPath,
  normalizePath,
} from '../seo/staticPages';

// Valeurs SEO par défaut, rendues une seule fois au niveau racine (App.jsx).
// Toute page avec son propre <Helmet> (ProductDetail, BlogPost...) écrase ces valeurs.
// Le titre, la description et le canonical suivent maintenant l'URL courante :
// les pages sans Helmet propre (shop, about, contact...) ne pointent plus vers l'accueil.
// Les mêmes valeurs sont utilisées par scripts/prerender.mjs pour le HTML généré au build.
const DefaultSEO = () => {
  const { pathname } = useLocation();
  const path = normalizePath(pathname);
  const { title, description } = getPageSeo(path);
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Peptides Weight Loss',
    url: `${SITE_URL}/`,
    description: DEFAULT_DESCRIPTION
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="peptides for weight loss, weight loss peptides, fat loss peptides, peptide therapy weight loss, best peptides 2026"
      />
      <link rel="canonical" href={canonical} />
      {isNoIndexPath(path) && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default DefaultSEO;
