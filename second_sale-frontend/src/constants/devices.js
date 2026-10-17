export const getBrandLogo = (brandName) => {
  if (!brandName) return null;
  const slug = brandName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (slug === 'mi') return '/brands/xiaomi.svg';
  return `/brands/${slug}.svg`;
};

export const BRANDS = [
  { name: "Apple", color: "#000000", models: 11, logo: "/brands/apple.svg" },
  { name: "Samsung", color: "#1428A0", models: 2, logo: "/brands/samsung.svg" },
  { name: "OnePlus", color: "#F5010C", models: 1, logo: "/brands/oneplus.svg" },
  { name: "Google", color: "#4285F4", models: 1, logo: "/brands/google.svg" },
  { name: "Xiaomi", color: "#FF6900", models: 1, logo: "/brands/xiaomi.svg" },
  { name: "Realme", color: "#FFC915", models: 1, logo: "/brands/realme.svg" },
  { name: "Vivo", color: "#415FFF", models: 1, logo: "/brands/vivo.svg" },
  { name: "OPPO", color: "#04803E", models: 1, logo: "/brands/oppo.svg" },
  { name: "Motorola", color: "#001428", models: 1, logo: "/brands/motorola.svg" },
  { name: "Nothing", color: "#000000", models: 1, logo: "/brands/nothing.svg" },
  { name: "iQOO", color: "#FFD400", models: 1, logo: "/brands/vivo.svg" },
  { name: "Poco", color: "#FFD400", models: 1, logo: "/brands/poco.svg" },
];

export const LAPTOP_BRANDS = [
  { name: 'Apple', color: '#000000', models: 10, logo: "/brands/apple.svg" },
  { name: 'Dell', color: '#0076CE', models: 8, logo: "/brands/dell.svg" },
  { name: 'HP', color: '#0096D6', models: 7, logo: "/brands/hp.svg" },
  { name: 'Lenovo', color: '#E2231A', models: 7, logo: "/brands/lenovo.svg" },
  { name: 'Asus', color: '#00539B', models: 7, logo: "/brands/asus.svg" },
  { name: 'Acer', color: '#83B81A', models: 5, logo: "/brands/acer.svg" },
  { name: 'Microsoft', color: '#737373', models: 3, logo: "/brands/microsoft.svg" },
  { name: 'MSI', color: '#ED1C24', models: 4, logo: "/brands/msi.svg" },
  { name: 'Razer', color: '#00E700', models: 3, logo: "/brands/razer.svg" },
  { name: 'Samsung', color: '#1428A0', models: 0, logo: "/brands/samsung.svg" },
  { name: 'LG', color: '#A50034', models: 0, logo: "/brands/lg.svg" },
  { name: 'Huawei', color: '#CF0A2C', models: 0, logo: "/brands/honor.svg" },
  { name: 'Mi', color: '#FF6900', models: 0, logo: "/brands/xiaomi.svg" },
  { name: 'MI', color: '#FF6900', models: 0, logo: "/brands/xiaomi.svg" },
  { name: 'Avita', color: '#2B0A3D', models: 0, logo: "/brands/avita.svg" },
];

export const IMAC_BRANDS = [
  { name: 'Apple', color: '#000000', models: 3, logo: "/brands/apple.svg" }
];

export const TABLET_BRANDS = [
  { name: 'Apple', color: '#000000', models: 81, logo: "/brands/apple.svg" },
  { name: 'Samsung', color: '#1428A0', models: 79, logo: "/brands/samsung.svg" },
  { name: 'Lenovo', color: '#E2231A', models: 12, logo: "/brands/lenovo.svg" },
  { name: 'Xiaomi', color: '#FF6900', models: 5, logo: "/brands/xiaomi.svg" },
  { name: 'OnePlus', color: '#F5010C', models: 3, logo: "/brands/oneplus.svg" },
  { name: 'Realme', color: '#FFC915', models: 4, logo: "/brands/realme.svg" },
  { name: 'Motorola', color: '#001428', models: 4, logo: "/brands/motorola.svg" },
  { name: 'Honor', color: '#000000', models: 4, logo: "/brands/honor.svg" },
  { name: 'OPPO', color: '#04803E', models: 2, logo: "/brands/oppo.svg" },
  { name: 'Nokia', color: '#124191', models: 3, logo: "/brands/nokia.svg" },
  { name: 'Poco', color: '#FFD400', models: 1, logo: "/brands/poco.svg" },
];

export const EARBUDS_BRANDS = [
  { name: "Apple", color: "#000000", models: 7, logo: "/brands/apple.svg" },
  { name: "Samsung", color: "#1428A0", models: 6, logo: "/brands/samsung.svg" },
  { name: "Sony", color: "#000000", models: 5, logo: "/brands/sony.svg" },
  { name: "Bose", color: "#000000", models: 5, logo: "/brands/bose.svg" },
  { name: "Google", color: "#4285F4", models: 4, logo: "/brands/google.svg" },
  { name: "OnePlus", color: "#F5010C", models: 5, logo: "/brands/oneplus.svg" },
  { name: "Sennheiser", color: "#000000", models: 4, logo: "/brands/sennheiser.svg" },
  { name: "Nothing", color: "#000000", models: 6, logo: "/brands/nothing.svg" },
  { name: "boAt", color: "#ED1C24", models: 5, logo: "/brands/xiaomi.svg" }
];

export const SMARTWATCH_BRANDS = [
  { name: "Apple", color: "#000000", models: 42, logo: "/brands/apple.svg" },
  { name: "Samsung", color: "#1428A0", models: 27, logo: "/brands/samsung.svg" },
  { name: "OnePlus", color: "#F5010C", models: 4, logo: "/brands/oneplus.svg" },
  { name: "Google", color: "#4285F4", models: 4, logo: "/brands/google.svg" }
];

export const GAMING_BRANDS = [
  { name: "Sony", color: "#000000", models: 28, logo: "/brands/sony.svg" },
  { name: "Microsoft", color: "#737373", models: 17, logo: "/brands/microsoft.svg" },
  { name: "Nintendo", color: "#E60012", models: 5, logo: "/brands/nintendo.svg" }
];
