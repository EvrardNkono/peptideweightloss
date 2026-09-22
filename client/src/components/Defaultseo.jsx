// src/components/DefaultSEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://peptidesweight-loss.com';

// ✅ Valeurs SEO par défaut de tout le site, rendues UNE SEULE FOIS
// au niveau racine (App.jsx), avant les <Routes>.
//
// Comment ça marche avec react-helmet-async :
// pour les balises "singleton" (title, canonical, meta description),
// le dernier <Helmet> monté dans l'arbre React gagne. Comme ce
// composant est rendu au-dessus des pages, toute page qui a son
// propre <Helmet> (Home, ProductDetail, BlogPost...) écrase
// automatiquement ces valeurs par défaut. Les pages qui n'ont pas
// encore leur propre <Helmet> (marketplace, faq, knowledge, account...)
// conservent ces valeurs par défaut au lieu de n'avoir AUCUN title/canonical.
const DefaultSEO = () => {
  const defaultTitle = 'Peptides for Weight Loss: Complete 2026 Guide & Comparison';
  const defaultDescription =
    'Compare the best peptides for weight loss in 2026 — effectiveness, safety, dosage, and side effects explained. Make an informed choice with our expert guide.';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Peptides Weight Loss',
    url: `${SITE_URL}/`,
    description: defaultDescription
  };

  return (
    <Helmet>
      <title>{defaultTitle}</title>
      <meta name="description" content={defaultDescription} />
      <meta
        name="keywords"
        content="peptides for weight loss, weight loss peptides, fat loss peptides, peptide therapy weight loss, best peptides 2026"
      />
      <link rel="canonical" href={`${SITE_URL}/`} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
      <meta property="og:url" content={`${SITE_URL}/`} />

      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />

      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default DefaultSEO;