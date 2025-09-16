// Heuristic image mapper for atoll/address labels.
// Extend by dropping appropriately named images in public/images/atolls/
// and adding new regex entries below.

export function getAtollImage(label: string): string {
  if (!label) return '/images/offers/1.jpg';
  const l = label.toLowerCase();

  const rules: Array<[RegExp, string]> = [
    [/baa/, '/images/offers/member-savings.jpg'],
    [/aa.? atoll|alif|ari/, '/images/offers/couples-special.jpg'],
    [/lhaviyani|lhavi/, '/images/offers/bundle-save.jpg'],
    [/male|malé|north male|south male/, '/images/offers/1.jpg'],
  ];

  for (const [re, img] of rules) {
    if (re.test(l)) return img;
  }

  // Hash fallback to select one of existing offer images (acts like placeholder variety)
  const fallbackSet = [
    '/images/offers/member-savings.jpg',
    '/images/offers/couples-special.jpg',
    '/images/offers/bundle-save.jpg',
    '/images/offers/1.jpg'
  ];
  let hash = 0;
  for (let i = 0; i < l.length; i++) hash = (hash * 31 + l.charCodeAt(i)) >>> 0;
  return fallbackSet[hash % fallbackSet.length];
}
