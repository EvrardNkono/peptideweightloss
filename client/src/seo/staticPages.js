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
    description: 'Explore our range of research peptides by category. High purity, lab-tested products with worldwide shipping from Peptides Weight Loss.',
    h1: 'Research Peptides',
  },
  '/shop/blends': {
    title: `Peptide Blends - ${SITE_NAME}`,
    description: 'Discover our peptide blends for research use. High purity, lab-tested blends with worldwide shipping from Peptides Weight Loss.',
    h1: 'Peptide Blends',
  },
  '/marketplace': {
    title: `Marketplace - ${SITE_NAME}`,
    description: 'Browse the full Peptides Weight Loss marketplace: research peptides, blends and other research compounds. Lab-tested, shipped worldwide.',
    h1: 'Marketplace',
  },
  '/blog': {
    title: `Peptides Weight Loss Blog - Guides & Research News`,
    description: 'Read our latest guides, comparisons and research news about peptides for weight loss, from storage and stability to metabolic research.',
    h1: 'Peptides Weight Loss Blog',
  },
  '/knowledge': {
    title: `Knowledge Center - ${SITE_NAME}`,
    description: 'Learn about peptides: how they work, synthesis and purification, solubility, storage and handling, with research resources for laboratories.',
    h1: 'Knowledge Center',
  },
  '/labs': {
    title: `Lab Testing & Quality - ${SITE_NAME}`,
    description: 'Lab testing and quality information for the peptides sold by Peptides Weight Loss: laboratory profiles, quality assurance and certifications.',
    h1: 'Lab Testing & Quality',
  },
  '/about': {
    title: `About Us - ${SITE_NAME}`,
    description: 'Learn more about Peptides Weight Loss: who we are, how our research peptides are tested and how we serve laboratories worldwide.',
    h1: 'About Us',
  },
  '/contact': {
    title: `Contact Us - ${SITE_NAME}`,
    description: 'Contact the Peptides Weight Loss team by email, phone or form. Answers on shipping, tracking, bulk pricing and returns for research orders.',
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

  // Profils de laboratoires : /labs/:slug
  const lm = p.match(/^\/labs\/([^/]+)$/);
  if (lm) {
    const lab = LAB_LIST.find((x) => x.slug === lm[1]);
    if (lab) return labSeo(lab);
  }

  // Pages catégories : /shop/peptides/:slug, /marketplace/:slug, /shop/:slug
  const m = p.match(/^\/(?:shop\/peptides|marketplace|shop)\/([^/]+)$/);
  if (m) {
    const name = humanize(m[1]);
    return {
      title: `${name} - ${SITE_NAME}`,
      description: `Browse ${name} at Peptides Weight Loss. High purity, lab-tested research products with worldwide shipping and tracking on every order.`,
      h1: name,
    };
  }
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, h1: DEFAULT_TITLE };
};

// ---------------------------------------------------------------------------
// Titres de pages dynamiques (produits, articles) limités à 60 caractères.
// Ordre de préférence : "Nom - Marque" > "Nom" seul > "Nom" coupé proprement.
// Partagé entre le script de build et les pages React pour rester identique.
// ---------------------------------------------------------------------------
export const MAX_TITLE_LENGTH = 60;

export const buildTitle = (name, suffix = SITE_NAME, max = MAX_TITLE_LENGTH) => {
  const clean = String(name ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return suffix;
  const withSuffix = `${clean} - ${suffix}`;
  if (withSuffix.length <= max) return withSuffix;
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s\-–—:,;(\[/]+$/, '')}…`;
};


// ---------------------------------------------------------------------------
// Contenu statique supplémentaire, rendu dans le HTML pré-généré (prerender.mjs)
// et utilisé pour les données structurées. Il reprend le contenu réel des pages
// React correspondantes (Contact.jsx, KnowledgeCenter.jsx, Labs.jsx) : si ces pages
// changent, mettre à jour ce fichier pour que le HTML statique reste fidèle.
// ---------------------------------------------------------------------------
export const CONTACT_EMAIL = 'contact@peptidesweight-loss.com';
export const CONTACT_PHONE = '+1 (619) 483-1046';
export const CONTACT_PHONE_RAW = '+16194831046';
export const CONTACT_HOURS = 'Mon-Fri: 9AM-6PM EST | 24/7 Email Support';

// Source unique : Contact.jsx importe cette liste pour afficher la FAQ.
export const CONTACT_FAQS = [
  { question: 'What is your shipping policy?', answer: 'We offer discreet worldwide shipping with tracking. Orders are processed within 24-48 hours.' },
  { question: 'Do you offer bulk pricing?', answer: 'Yes, for research institutions and volume orders, please contact our sales team directly.' },
  { question: 'How do I track my order?', answer: 'Once shipped, you will receive a tracking number via email.' },
  { question: 'What is your return policy?', answer: 'We offer a 30-day satisfaction guarantee for unopened products.' },
];

export const KNOWLEDGE_ITEMS = [
  {
    "title": "Understanding Peptide Bonds",
    "excerpt": "How Is The Bond Created? When two amino acids form a covalent bond, it creates a peptide bond."
  },
  {
    "title": "Peptide Synthesis",
    "excerpt": "The Process of Peptide Synthesis Solution Phase Synthesis (SPS) was the original approach to peptide synthesis."
  },
  {
    "title": "Peptide Solubility",
    "excerpt": "How To Find The Best Peptide Solubility Option Figuring out the most effective solvent to dissolve peptides is possibly one of the most difficult components when working…"
  },
  {
    "title": "Standard Procedure For Storing Peptides",
    "excerpt": "Long-term peptide storage over several months and years demands proper refrigeration. The preferred and usual temperature for storage is -80°C (-112°F)."
  },
  {
    "title": "Peptide Purification",
    "excerpt": "Here you will find information on the different aspects of peptide purification that take place during synthesis, different strategies and methods, and possible…"
  },
  {
    "title": "GLP-1 Agonists: Mechanism of Action",
    "excerpt": "GLP-1 receptor agonists mimic the natural incretin hormone, enhancing insulin secretion, suppressing glucagon release, and promoting satiety."
  },
  {
    "title": "Reconstitution Guide for Peptides",
    "excerpt": "Proper reconstitution is critical for peptide research. Learn the correct procedures for dissolving lyophilized peptides using appropriate solvents and maintaining…"
  },
  {
    "title": "Peptide Stability and Degradation",
    "excerpt": "Understanding factors that affect peptide stability, including temperature, pH, and light exposure, is essential for maintaining research integrity"
  }
];

export const LAB_LIST = [
  {
    "slug": "quanta",
    "name": "Quanta",
    "fullName": "Quanta Biosciences",
    "description": "Gold Standard in peptide research and development. Industry leader in quality control and third-party verification.",
    "founded": 2008,
    "headquarters": "Basel, Switzerland",
    "facilities": [
      "Switzerland",
      "USA",
      "Germany"
    ],
    "specialties": [
      "Research Peptides",
      "GLP-1 Agonists",
      "Growth Hormone Secretagogues"
    ],
    "products": [
      "Semaglutide",
      "Tirzepatide",
      "Retatrutide",
      "Tesamorelin"
    ]
  },
  {
    "slug": "viogen",
    "name": "Viogen",
    "fullName": "Viogen Laboratories",
    "description": "Cult Favorite among researchers. Known for innovation and customer-centric approach.",
    "founded": 2012,
    "headquarters": "Vienna, Austria",
    "facilities": [
      "Austria",
      "Netherlands"
    ],
    "specialties": [
      "Peptide Blends",
      "Custom Synthesis",
      "Research Kits"
    ],
    "products": [
      "BPC-157 + TB-500",
      "CJC-1295 + Ipamorelin",
      "GHRP-2/GHRP-6"
    ]
  },
  {
    "slug": "deus-medical",
    "name": "Deus Medical",
    "fullName": "Deus Medical Research",
    "description": "The Consistent Performer. Reliable quality with exceptional consistency across all batches.",
    "founded": 2010,
    "headquarters": "Madrid, Spain",
    "facilities": [
      "Spain",
      "Portugal"
    ],
    "specialties": [
      "Metabolic Peptides",
      "Research Standards",
      "Clinical Grade"
    ],
    "products": [
      "Semaglutide",
      "Tirzepatide",
      "MOTS-c",
      "SS-31"
    ]
  },
  {
    "slug": "balkan",
    "name": "Balkan Pharmaceuticals",
    "fullName": "Balkan Pharmaceuticals",
    "description": "Pharma-Grade Quality. Pharmaceutical standards applied to research peptides.",
    "founded": 2005,
    "headquarters": "Chisinau, Moldova",
    "facilities": [
      "Moldova",
      "Romania"
    ],
    "specialties": [
      "Pharmaceutical Grade",
      "Clinical Research",
      "API Manufacturing"
    ],
    "products": [
      "Semaglutide",
      "Tirzepatide",
      "HGH Fragments"
    ]
  },
  {
    "slug": "pharmacom",
    "name": "Pharmacom",
    "fullName": "Pharmacom Labs",
    "description": "Legacy Name in peptide research. Two decades of experience and expertise.",
    "founded": 2006,
    "headquarters": "Hong Kong",
    "facilities": [
      "Hong Kong",
      "China"
    ],
    "specialties": [
      "Comprehensive Catalog",
      "Research Support",
      "Technical Documentation"
    ],
    "products": [
      "Complete peptide line",
      "SARMs",
      "Research Chemicals"
    ]
  },
  {
    "slug": "pharmaqo",
    "name": "Pharmaqo",
    "fullName": "Pharmaqo Labs",
    "description": "The New Contender. Modern facilities with cutting-edge technology.",
    "founded": 2015,
    "headquarters": "Manchester, UK",
    "facilities": [
      "United Kingdom",
      "Ireland"
    ],
    "specialties": [
      "Next-Generation Peptides",
      "Novel Compounds",
      "Research Innovation"
    ],
    "products": [
      "New peptide sequences",
      "Advanced blends",
      "Research standards"
    ]
  },
  {
    "slug": "intex-pharma",
    "name": "Intex Pharma",
    "fullName": "Intex Pharmaceuticals",
    "description": "The Specialist. Focused on high-purity compounds and specialized peptides.",
    "founded": 2014,
    "headquarters": "Prague, Czech Republic",
    "facilities": [
      "Czech Republic"
    ],
    "specialties": [
      "High-Purity Peptides",
      "Specialty Compounds",
      "Custom Synthesis"
    ],
    "products": [
      "AOD-9604",
      "MOTS-c",
      "SS-31",
      "Humanin"
    ]
  },
  {
    "slug": "status",
    "name": "Status",
    "fullName": "Status Research Labs",
    "description": "The Underrated Pick. Exceptional value with quality that exceeds expectations.",
    "founded": 2016,
    "headquarters": "Tallinn, Estonia",
    "facilities": [
      "Estonia",
      "Latvia"
    ],
    "specialties": [
      "Value Research Peptides",
      "Essential Compounds",
      "Quality Assurance"
    ],
    "products": [
      "Essential peptide line",
      "Research basics",
      "Core compounds"
    ]
  },
  {
    "slug": "atech",
    "name": "A-Tech Labs",
    "fullName": "A-Tech Laboratories",
    "description": "The Transparent One. Full disclosure and complete testing transparency.",
    "founded": 2017,
    "headquarters": "Warsaw, Poland",
    "facilities": [
      "Poland"
    ],
    "specialties": [
      "Transparent Testing",
      "Documented Quality",
      "Research Support"
    ],
    "products": [
      "Full testing documentation",
      "Verified peptides",
      "Research standards"
    ]
  },
  {
    "slug": "morph",
    "name": "Morph",
    "fullName": "Morph Research Labs",
    "description": "High Potential. Emerging leader with strong quality metrics.",
    "founded": 2019,
    "headquarters": "Ljubljana, Slovenia",
    "facilities": [
      "Slovenia"
    ],
    "specialties": [
      "Emerging Standards",
      "Quality Focus",
      "Customer Service"
    ],
    "products": [
      "Core peptide line",
      "Essential compounds",
      "Quality research materials"
    ]
  }
];

export const STATIC_INTRO = {
  '/about': [
    'Peptides Weight Loss is an online supplier of research peptides, peptide blends and related research compounds. Our catalog is organized into research peptides, blends and marketplace categories, so laboratories and researchers can find a product, compare options and order from one place.',
    'Our batches are tested by independent laboratories, and HPLC purity reports are available so that researchers can verify what they receive. Every product page lists its description and price, and all products are sold for research purposes only.',
    'We ship worldwide with tracking, and our support team answers questions about orders, bulk pricing and returns by email and phone. Browse the shop or the marketplace, read the Knowledge Center for background on peptide research, or contact us directly.',
    'Our catalog covers research peptides, peptide blends and other research compounds, grouped by category in the marketplace. Product pages show the description and price, and the cart and checkout let you place an order for research use. For volume or institutional orders, contact our sales team directly, and for guidance on handling, storage and reconstitution, see the Knowledge Center.',
  ],
  '/contact': [
    'Have questions about our research peptides? Our scientific support team is here to help. Send us a message through the contact form, write to us by email or call us, and we will get back to you as soon as possible.',
    'Before you write, you may find your answer in the frequently asked questions below, which cover shipping, tracking, bulk pricing and returns. For research institutions and volume orders, tell us which organization you represent and which products you need, so that our sales team can help you quickly.',
  ],
  '/knowledge': [
    'The Knowledge Center collects educational articles for researchers who work with peptides, from the chemistry of peptide bonds to synthesis, purification, solubility, reconstitution, storage and stability. Use these guides together with the product pages and the quality information in our Lab Testing section.',
  ],
  '/labs': [
    'Every product we sell comes from a laboratory whose quality processes we document. This section presents the laboratories behind our catalog, with an overview of their quality assurance and certifications, so researchers can see where a product comes from before they order.',
    'Each laboratory profile gives an overview of the laboratory, the products available from it and its quality assurance information. Use these profiles together with the product pages when you compare options for your research.',
  ],
};

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.svg`,
  description: 'Online supplier of lab-tested research peptides, peptide blends and related research compounds, shipping worldwide.',
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE_RAW,
  areaServed: 'Worldwide',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_RAW,
    availableLanguage: 'English',
    areaServed: 'Worldwide',
  },
});

export const buildFaqSchema = (faqs = CONTACT_FAQS) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

// SEO d'un profil de laboratoire (/labs/:slug) : même calcul côté build et côté React.
export function labSeo(lab) {
  const base = `${lab.fullName}: ${lab.description} Laboratory profile, specialties and products at ${SITE_NAME}.`;
  let description = base;
  if (base.length > 160) {
    const cut = base.slice(0, 159);
    description = `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.-]+$/, '')}…`;
  }
  return { title: buildTitle(lab.fullName, SITE_NAME), description, h1: lab.fullName };
}
