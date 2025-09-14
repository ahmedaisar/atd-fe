export interface AtollInfo {
  name: string;
  hotelCount: number;
  image?: string;
  highlights?: string[];
}

/**
 * Extract atoll categories and hotel counts from hotel records in sample-api-response.json
 * @param hotels Hotel records array from API
 */
export function extractAtollInfo(hotels: any[]): AtollInfo[] {
  // Canonical atoll names and highlights
  const atollNames = [
    "North Male Atoll",
    "South Male Atoll",
    "Ari Atoll",
    "Baa Atoll",
    "Lhaviyani Atoll",
    "Raa Atoll",
    "Noonu Atoll",
    "Dhaalu Atoll",
    "Gaafu Alifu Atoll",
    "Gaafu Dhaalu Atoll",
    "Meemu Atoll",
    "Thaa Atoll",
    "Laamu Atoll",
    "Shaviyani Atoll",
    "Vaavu Atoll",
    "Faafu Atoll",
    "Haa Alifu Atoll",
    "Haa Dhaalu Atoll",
    "Addu Atoll",
    "Unknown"
  ];
  const atollHighlightsMap: Record<string, string[]> = {
    "North Male Atoll": [
      "Close to Malé airport",
      "Great for diving",
      "Luxury resorts",
    ],
    "South Male Atoll": [
      "Surfing spots",
      "Family-friendly resorts",
      "Snorkeling",
    ],
    "Ari Atoll": [
      "Whale shark sightings",
      "Diving paradise",
      "Romantic getaways",
    ],
    "Baa Atoll": [
      "UNESCO Biosphere Reserve",
      "Manta ray hotspots",
      "Eco-friendly resorts",
    ],
    "Lhaviyani Atoll": [
      "Secluded islands",
      "Great house reefs",
      "Romantic escapes",
    ],
    "Raa Atoll": [
      "Emerging luxury resorts",
      "Diving and snorkeling",
      "Peaceful atmosphere",
    ],
    "Noonu Atoll": [
      "Ultra-luxury resorts",
      "Pristine beaches",
      "Water sports",
    ],
    "Dhaalu Atoll": [
      "Family resorts",
      "Dolphin watching",
      "Diving sites",
    ],
    "Gaafu Alifu Atoll": [
      "Untouched nature",
      "Remote getaways",
      "Diving adventures",
    ],
    "Gaafu Dhaalu Atoll": [
      "Surfing",
      "Local island experiences",
      "Diving",
    ],
    "Meemu Atoll": [
      "Surfing spots",
      "Quiet islands",
      "Snorkeling",
    ],
    "Thaa Atoll": [
      "Surfing",
      "Secluded resorts",
      "Marine life",
    ],
    "Laamu Atoll": [
      "Eco-luxury resorts",
      "Surf breaks",
      "Diving",
    ],
    "Shaviyani Atoll": [
      "Private islands",
      "Luxury escapes",
      "Snorkeling",
    ],
    "Vaavu Atoll": [
      "Channel diving",
      "Shark encounters",
      "Peaceful islands",
    ],
    "Faafu Atoll": [
      "Small atoll feel",
      "Diving",
      "Relaxation",
    ],
    "Haa Alifu Atoll": [
      "Northernmost atoll",
      "Local culture",
      "Diving",
    ],
    "Haa Dhaalu Atoll": [
      "Remote islands",
      "Diving",
      "Local experiences",
    ],
    "Addu Atoll": [
      "Southernmost atoll",
      "WWII history",
      "Unique culture",
    ],
    "Unknown": [
      "Explore more",
    ]
  };

  // For each atoll, count hotels and get preview image
  return atollNames.map(atoll => {
    // Find all hotels matching this atoll (address or city contains atoll name)
    const hotelsForAtoll = hotels.filter((hotel: any) => {
      const addr = hotel?.location?.address || "";
      const city = hotel?.location?.city || "";
      return (
        addr.toLowerCase().includes(atoll.toLowerCase()) ||
        city.toLowerCase().includes(atoll.toLowerCase())
      );
    });
    const hotelCount = hotelsForAtoll.length;
    // Use first image from first hotel as preview
    let image: string | undefined = undefined;
    if (hotelsForAtoll.length > 0 && hotelsForAtoll[0].images && hotelsForAtoll[0].images[0]?.image_id) {
      image = `//img1.hotelscan.com/640_440/1/${hotelsForAtoll[0].images[0].image_id}.jpg`;
    }
    const highlights = atollHighlightsMap[atoll] || [];
    return {
      name: atoll,
      hotelCount,
      image,
      highlights,
    };
  });
}
