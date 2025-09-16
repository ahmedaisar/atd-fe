import fs from 'fs/promises';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'data', 'generated');
const HOTELS_FILE = path.join(OUT_DIR, 'hotels-fetched.json');
const TOP_FILE = path.join(OUT_DIR, 'TopRatedHotels.json');

async function main() {
  try {
    const raw = await fs.readFile(HOTELS_FILE, 'utf8');
    const hotels = JSON.parse(raw);
    if (!Array.isArray(hotels)) throw new Error('Expected array in hotels-fetched.json');

    const top = hotels
      .filter(h => {
        const rating = h?.quality?.review_rating ?? h?.review_rating ?? h?.rating;
        return typeof rating === 'number' && rating >= 90;
      })
      .map(h => {
        const rating = h?.quality?.review_rating ?? h?.review_rating ?? h?.rating;
        return {
          id: h.hs_id || h.id || h.slug,
            slug: h.slug,
            name: h.name,
            address: h.location?.address || h.address || null,
            city: h.location?.city || null,
            rating,
            stars: h.quality?.stars ?? null,
            best_offer: h.best_offer ?? null,
            worst_offer: h.worst_offer ?? null,
            discount: h.discount ?? null,
            offers_count: h.offers_count ?? (Array.isArray(h.offers) ? h.offers.length : null),
            hero_image_id: h.images?.[0]?.image_id ?? null,
            images: (h.images || []).slice(0, 6),
            partner_best: h.hero_offer?.partner_name || h.offers?.[0]?.partner_name || null
        };
      })
      .sort((a,b) => b.rating - a.rating || (a.best_offer || 0) - (b.best_offer || 0));

    await fs.writeFile(TOP_FILE, JSON.stringify(top, null, 2));
    console.log(`[extract-top-rated] Wrote ${top.length} top-rated hotels (>=90) -> ${TOP_FILE}`);
  } catch (e) {
    console.error('[extract-top-rated] Failed:', e.message);
    process.exitCode = 1;
  }
}

main();
