export const SITE_URL = 'https://secondsale.in';
export const SITE_NAME = 'SecondSale';
export const LEGAL_NAME = 'Swastika Innovation Private Limited';
export const DEFAULT_TITLE = 'SecondSale — Sell Old Devices for Instant Cash in India';
export const DEFAULT_DESCRIPTION =
  "SecondSale is India's trusted device buyback platform. Sell old mobile phones, tablets, laptops and iMac online with free doorstep pickup and instant payment across 2,000+ cities.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.svg`;
export const PHONE = '+91-8310732405';
export const WHATSAPP = '918310732405';
export const SUPPORT_EMAIL = 'support@secondsale.in';

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/secondsale',
  instagram: 'https://instagram.com/secondsale',
  facebook: 'https://facebook.com/secondsale',
  linkedin: 'https://linkedin.com/company/secondsale',
};

export const SAME_AS = Object.values(SOCIAL_LINKS);

export const ENTITY_SUMMARY =
  'SecondSale is an Indian online platform where consumers sell used smartphones, tablets, laptops, and iMacs. Users receive an instant quote, schedule free doorstep pickup, and get paid via UPI, bank transfer, or cash after device verification. SecondSale operates across 2,000+ Indian cities and is operated by Swastika Innovation Private Limited.';

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function formatSeoTitle(title) {
  if (!title) return DEFAULT_TITLE;
  if (title.includes('SecondSale')) return title;
  return `${title} | SecondSale`;
}

export const CATEGORY_SEO = {
  mobile: {
    label: 'Mobile Phones',
    brandPath: '/sell-old-mobile-phones/brand',
    pathPrefix: '/sell-old-mobile-phones',
    category: 'mobile',
    title: 'Sell Old Mobile Phones Online — Instant Cash | SecondSale',
    description:
      'Sell your old mobile phone online at the best price. Free doorstep pickup, instant payment, and transparent pricing across 2,000+ cities in India.',
  },
  tablet: {
    label: 'Tablets',
    brandPath: '/sell-tablet/brand',
    pathPrefix: '/sell-tablet',
    category: 'tablet',
    title: 'Sell Old Tablets Online — Instant Cash | SecondSale',
    description:
      'Sell your used iPad or Android tablet online. Get instant quotes, free pickup, and secure payment with SecondSale across India.',
  },
  laptop: {
    label: 'Laptops',
    brandPath: '/sell-old-laptops/brand',
    pathPrefix: '/sell-old-laptops',
    category: 'laptop',
    title: 'Sell Old Laptops Online — Best Price | SecondSale',
    description:
      'Sell your used laptop online in India. Dell, HP, Lenovo, Apple and more. Free pickup and instant payment after verification.',
  },
  mac: {
    label: 'iMac & Mac',
    brandPath: '/sell-imac/brand',
    pathPrefix: '/sell-imac',
    category: 'mac',
    title: 'Sell iMac & Mac Online — Instant Cash | SecondSale',
    description:
      'Sell your used iMac or Mac online. Instant price check, free doorstep pickup, and secure payment with SecondSale.',
  },
};
