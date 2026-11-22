/**
 * Exact Cashify Mobile Series Configuration
 * Supported brands: Samsung, Xiaomi, Vivo, Oppo, Realme, Motorola, Pixel (Google), Poco
 */

export const BRAND_SERIES_CONFIG = {
  samsung: {
    brandName: "Samsung",
    series: [
      { id: "galaxy-a-series", name: "Galaxy A Series", pattern: /\b(galaxy\s+a\d|a\d+\b)/i },
      { id: "galaxy-j-series", name: "Galaxy J Series", pattern: /\b(galaxy\s+j\d|j\d+\b)/i },
      { id: "galaxy-z-flip-series", name: "Galaxy Z Flip Series", pattern: /\b(z\s*flip|flip\b)/i },
      { id: "galaxy-fold-series", name: "Galaxy Fold Series", pattern: /\b(z\s*fold|galaxy\s+fold|fold\b)/i },
      { id: "galaxy-s-series", name: "Galaxy S Series", pattern: /\b(galaxy\s+s\d|s\d+\b|galaxy\s+s\b)/i },
      { id: "galaxy-note-series", name: "Galaxy Note Series", pattern: /\b(note)\b/i },
      { id: "galaxy-m-series", name: "Galaxy M Series", pattern: /\b(galaxy\s+m\d|m\d+\b)/i },
      { id: "galaxy-f-series", name: "Galaxy F Series", pattern: /\b(galaxy\s+f\d|f\d+\b)/i },
      { id: "galaxy-on-series", name: "Galaxy On Series", pattern: /\b(on\d+|on\s*\d+|on\s*max|on\s*nxt)/i },
      { id: "galaxy-c-series", name: "Galaxy C Series", pattern: /\b(galaxy\s+c\d|c\d+\b)/i },
    ]
  },
  xiaomi: {
    brandName: "Xiaomi",
    series: [
      { id: "redmi-note-series", name: "Redmi Note Series", pattern: /redmi\s+note/i },
      { id: "redmi-series", name: "Redmi Series", pattern: /redmi\s*(\d+[a-z]*|a\d+|c\d+|prime|go|activ|power)/i },
      { id: "mi-series", name: "Mi Series", pattern: /(xiaomi|mi\s+\d+|mi\s+1|mi\s+a|mi\s+mix|mi\s+max|11i|11t|14\s*civi|black\s*shark)/i },
      { id: "redmi-k-series", name: "Redmi K Series", pattern: /redmi\s*k\d+/i },
      { id: "redmi-y-series", name: "Redmi Y Series", pattern: /redmi\s*y\d+/i },
    ]
  },
  vivo: {
    brandName: "Vivo",
    series: [
      { id: "v-series", name: "V Series", pattern: /\bv\d+/i },
      { id: "x-series", name: "X Series", pattern: /\bx\d+|\bx\s*fold|nex/i },
      { id: "y-series", name: "Y Series", pattern: /\by\d+/i },
      { id: "t-series", name: "T Series", pattern: /\bt\d+/i },
      { id: "s-series", name: "S Series", pattern: /\bs\d+/i },
      { id: "z-series", name: "Z Series", pattern: /\bz\d+/i },
      { id: "u-series", name: "U Series", pattern: /\bu\d+/i },
    ]
  },
  oppo: {
    brandName: "OPPO",
    series: [
      { id: "reno-series", name: "Reno Series", pattern: /reno/i },
      { id: "f-series", name: "F Series", pattern: /\bf\d+/i },
      { id: "a-series", name: "A Series", pattern: /\ba\d+/i },
      { id: "find-series", name: "Find Series", pattern: /find/i },
      { id: "k-series", name: "K Series", pattern: /\bk\d+/i },
      { id: "r-series", name: "R Series", pattern: /\br\d+/i },
    ]
  },
  realme: {
    brandName: "Realme",
    series: [
      { id: "realme-narzo-series", name: "Realme Narzo Series", pattern: /narzo/i },
      { id: "realme-gt-series", name: "Realme GT Series", pattern: /gt/i },
      { id: "realme-number-series", name: "Realme Number Series", pattern: /\b(realme\s+\d+|realme\s+\d+[a-z]+)\b/i },
      { id: "realme-c-series", name: "Realme C Series", pattern: /\bc\d+/i },
      { id: "realme-x-series", name: "Realme X Series", pattern: /\bx\d+/i },
      { id: "realme-p-series", name: "Realme P Series", pattern: /\bp\d+/i },
    ]
  },
  motorola: {
    brandName: "Motorola",
    series: [
      { id: "moto-g-series", name: "Moto G Series", pattern: /\bg\d+|moto\s+g\b/i },
      { id: "moto-edge-series", name: "Moto Edge Series", pattern: /edge/i },
      { id: "moto-razr-series", name: "Moto Razr Series", pattern: /razr/i },
      { id: "moto-e-series", name: "Moto E Series", pattern: /\be\d+/i },
      { id: "moto-one-series", name: "Moto One Series", pattern: /\bone\b/i },
      { id: "moto-z-series", name: "Moto Z Series", pattern: /\bz\d+/i },
    ]
  },
  pixel: {
    brandName: "Pixel",
    series: [
      { id: "pixel-10-series", name: "Pixel 10 Series", pattern: /pixel\s+10\b/i },
      { id: "pixel-9-series", name: "Pixel 9 Series", pattern: /pixel\s+9\b/i },
      { id: "pixel-8-series", name: "Pixel 8 Series", pattern: /pixel\s+8\b/i },
      { id: "pixel-7-series", name: "Pixel 7 Series", pattern: /pixel\s+7\b/i },
      { id: "pixel-6-series", name: "Pixel 6 Series", pattern: /pixel\s+6\b/i },
      { id: "pixel-4-series", name: "Pixel 4 Series", pattern: /pixel\s+4\b/i },
      { id: "pixel-a-series", name: "Pixel A-Series", pattern: /\d+a\b/i },
      { id: "pixel-fold-series", name: "Pixel Fold Series", pattern: /fold/i },
    ]
  },
  poco: {
    brandName: "POCO",
    series: [
      { id: "poco-x-series", name: "POCO X Series", pattern: /\bx\d+/i },
      { id: "poco-m-series", name: "POCO M Series", pattern: /\bm\d+/i },
      { id: "poco-f-series", name: "POCO F Series", pattern: /\bf\d+/i },
      { id: "poco-c-series", name: "POCO C Series", pattern: /\bc\d+/i },
    ]
  }
};

// Aliases
BRAND_SERIES_CONFIG.google = BRAND_SERIES_CONFIG.pixel;
BRAND_SERIES_CONFIG.mi = BRAND_SERIES_CONFIG.xiaomi;
BRAND_SERIES_CONFIG.moto = BRAND_SERIES_CONFIG.motorola;

export function normalizeBrandKey(brand) {
  if (!brand) return "";
  const clean = String(brand).toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  if (clean.includes("samsung")) return "samsung";
  if (clean.includes("xiaomi") || clean === "mi") return "xiaomi";
  if (clean.includes("vivo")) return "vivo";
  if (clean.includes("oppo")) return "oppo";
  if (clean.includes("realme")) return "realme";
  if (clean.includes("motorola") || clean === "moto") return "motorola";
  if (clean.includes("pixel") || clean.includes("google")) return "pixel";
  if (clean.includes("poco")) return "poco";
  return clean;
}

export function getBrandSeriesConfig(brand) {
  const key = normalizeBrandKey(brand);
  return BRAND_SERIES_CONFIG[key] || null;
}

export function classifyDeviceSeries(brand, modelName) {
  const config = getBrandSeriesConfig(brand);
  if (!config) return "";
  const name = String(modelName || "").trim();
  for (const s of config.series) {
    if (s.pattern.test(name)) {
      return s.name;
    }
  }
  return "Other Models";
}

export function slugifySeries(nameOrId) {
  return String(nameOrId || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findSeries(brand, slugOrName) {
  const config = getBrandSeriesConfig(brand);
  if (!config || !slugOrName) return null;
  const target = slugifySeries(slugOrName);
  return config.series.find(
    s => s.id === target || slugifySeries(s.name) === target || slugifySeries(s.id) === target
  ) || null;
}
