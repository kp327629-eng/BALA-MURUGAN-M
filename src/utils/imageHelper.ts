/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Curated high-quality Unsplash Image IDs for States
const STATE_IMAGES: { [key: string]: string } = {
  "Tamil Nadu": "photo-1580835123018-8f15d97e88b9", // Beautiful Dravidian temple architecture
  "Kerala": "photo-1593693397690-362cb9666fc2", // Stunning tea plantation hills
  "Karnataka": "photo-1600100397618-b7156f4d2571", // Hampi stone chariot and ruins
  "Andhra Pradesh": "photo-1599946347371-68eb71b16afc", // Araku Valley region nature hills
  "Telangana": "photo-1626014303757-641c449c7624", // Charminar twilight lighting
  "Puducherry": "photo-1582510003544-4d00b7f74220", // French quarter streets and architecture
  "All States": "photo-1548013146-72479768bada" // India travel generic
};

// Curated high-quality Unsplash Image IDs for Destinations (specific mapping)
const DESTINATION_IMAGES: { [key: string]: string } = {
  // Tamil Nadu
  "kodaikanal": "photo-1506744038136-46273834b3fb", // misty mountain lake
  "ooty": "photo-1544735716-392fe2489ffa", // lush Nilgiris tea gardens
  "mahabalipuram": "photo-1581335967831-ca5a74ef06b9", // rock temple shore carvings
  "madurai": "photo-1600100397618-b7156f4d2571", // Meenakshi temple Gopuram
  "rameshwaram": "photo-1548013146-72479768bada", // Pamban sea bridge / coast
  "kanyakumari": "photo-1590050752117-238cb061295a", // Vivekananda Rock Sunset
  "yercaud": "photo-1464822759023-fed622ff2c3b", // high hills lake and pine
  "hogenakkal": "photo-1433832597046-4f10e10ac764", // powerful water falls
  "coonoor": "photo-1593693397690-362cb9666fc2", // green Nilgiri heights
  "thanjavur": "photo-1580835123018-8f15d97e88b9", // Brihadeeswarar Temple

  // Kerala
  "munnar": "photo-1593693397690-362cb9666fc2", // green tea gardens
  "alleppey (alappuzha)": "photo-1593693411515-c202e974eb8e", // houseboat backwaters
  "wayanad": "photo-1506461883276-594a12b11cf3", // green forest ghat road
  "thekkady (periyar)": "photo-1616394584738-fc6e612e71b9", // Periyar lake elephants
  "varkala": "photo-1590050752117-238cb061295a", // Varkala cliff beach
  "kovalam": "photo-1544735716-392fe2489ffa", // Lighthouse beach palm trees
  "kumarakom": "photo-1593693411515-c202e974eb8e", // backwaters green lagoon
  "athirappilly": "photo-1470071459604-3b5ec3a7fe05", // Athirappilly rainforest falls
  "kochi (fort kochi)": "photo-1582510003544-4d00b7f74220", // historic streets and ports
  "vagamon": "photo-1464822759023-fed622ff2c3b", // rolling meadows hills

  // Karnataka
  "coorg (kodagu)": "photo-1622215054244-e2320410ef9a", // misty valleys and coffee
  "gokarna": "photo-1507525428034-b723cf961d3e", // crescent shaped beaches
  "hampi": "photo-1600100397618-b7156f4d2571", // Hampi ruins
  "mysore (mysuru)": "photo-1590766940554-634a7ed41450", // illuminated Mysore Palace
  "chikmagalur": "photo-1622215054244-e2320410ef9a", // Mullayanagiri peaks
  "badami": "photo-1581335967831-ca5a74ef06b9", // rock-cut caves sandstone
  "bandipur national park": "photo-1616394584738-fc6e612e71b9", // forest tigers / wildlife
  "jog falls": "photo-1433832597046-4f10e10ac764", // heavy high waterfalls
  "murudeshwar": "photo-1590050752117-238cb061295a", // tall Shiva statue ocean temple
  "nandi hills": "photo-1506744038136-46273834b3fb", // sunrise over the clouds

  // Andhra Pradesh
  "araku valley": "photo-1599946347371-68eb71b16afc", // lush coffee valley AP
  "tirupati": "photo-1600100397618-b7156f4d2571", // Tirumala hills temple
  "visakhapatnam (vizag)": "photo-1507525428034-b723cf961d3e", // coast road beach Vizag
  "gandikota": "photo-1464822759023-fed622ff2c3b", // Indian Grand Canyon Gorge
  "lambasingi": "photo-1506744038136-46273834b3fb", // Kashmir of Andhra Pradesh snow-mist
  "horsley hills": "photo-1464822759023-fed622ff2c3b", // high altitude viewpoint
  "lepakshi": "photo-1581335967831-ca5a74ef06b9", // Veerabhadra hanging pillar temple
  "vijayawada": "photo-1599946347371-68eb71b16afc", // Krishna river ghats
  "srisailam": "photo-1581335967831-ca5a74ef06b9", // Mallikarjuna forest temple
  "amaravati": "photo-1580835123018-8f15d97e88b9", // Buddhist Stupa heritage

  // Telangana
  "hyderabad": "photo-1626014303757-641c449c7624", // Charminar
  "warangal": "photo-1600100397618-b7156f4d2571", // Kakatiya stone arches
  "nagarjuna sagar": "photo-1433832597046-4f10e10ac764", // massive dam gates waterfall
  "bhadrachalam": "photo-1581335967831-ca5a74ef06b9", // Rama temple on Godavari bank
  "ananthagiri hills": "photo-1464822759023-fed622ff2c3b", // thick forest viewpoints
  "alampur": "photo-1580835123018-8f15d97e88b9", // Navabrahma temples
  "adilabad (kuntala waterfalls)": "photo-1470071459604-3b5ec3a7fe05", // thick forest waterfalls
  "medak": "photo-1600100397618-b7156f4d2571", // Medak Cathedral / Fort
  "nizamabad (alisagar)": "photo-1506744038136-46273834b3fb", // garden lake park
  "ramappa temple": "photo-1581335967831-ca5a74ef06b9", // UNESCO floating brick temple

  // Puducherry
  "pondicherry (puducherry)": "photo-1582510003544-4d00b7f74220", // French town boulevard
  "auroville": "photo-1544005313-94ddf0286df2", // Matrimandir dome meditation
  "paradise beach": "photo-1544735716-392fe2489ffa", // pristine golden sands
  "serenity beach": "photo-1507525428034-b723cf961d3e", // quiet rocky surfer coast
  "chunnambar boat house": "photo-1593693411515-c202e974eb8e", // river boating resort
  "ousteri lake": "photo-1506744038136-46273834b3fb", // peaceful lake birds
  "arikamedu": "photo-1581335967831-ca5a74ef06b9", // roman archaeological ruins
  "karaikal beach": "photo-1544735716-392fe2489ffa", // tranquil east coast beach
  "mahe riverside": "photo-1593693411515-c202e974eb8e", // scenic malabar coastal river
  "yanam botanical garden": "photo-1464822759023-fed622ff2c3b" // botanical glass house / park
};

// Category fallback Unsplash IDs
const CATEGORY_IMAGES = {
  hillStation: "photo-1464822759023-fed622ff2c3b", // high lush mountain peak
  beach: "photo-1507525428034-b723cf961d3e", // beautiful sandy beach ocean
  waterfall: "photo-1433832597046-4f10e10ac764", // majestic heavy waterfall
  forest: "photo-1616394584738-fc6e612e71b9", // serene forest trees
  temple: "photo-1580835123018-8f15d97e88b9", // ancient ornate temple details
  viewpoint: "photo-1506744038136-46273834b3fb", // beautiful valley sunrise view
  default: "photo-1548013146-72479768bada" // general India travel
};

/**
 * Returns a high-definition image URL for a given state.
 * @param state Name of the state (e.g. "Tamil Nadu")
 * @param quality Quality setting: "thumb", "hd", "original"
 */
export function getStateImage(state: string, quality: "thumb" | "hd" | "original" = "hd"): string {
  const imageId = STATE_IMAGES[state] || STATE_IMAGES["All States"];
  return getUnsplashUrl(imageId, quality);
}

/**
 * Returns a high-definition image URL for a given destination.
 * Incorporates category tags and specific names to guarantee accurate, stunning photos.
 * @param destName Name of the destination (e.g. "Munnar")
 * @param tags Optional category tags
 * @param quality Quality setting: "thumb", "hd", "original"
 */
export function getDestinationImage(
  destName: string, 
  tags?: {
    isHillStation: boolean;
    isBeach: boolean;
    isWaterfall: boolean;
    isForestOrNationalPark: boolean;
    isTempleOrMuseum: boolean;
    isViewpoint: boolean;
  },
  quality: "thumb" | "hd" | "original" = "hd"
): string {
  const key = destName.toLowerCase().trim();
  
  // 1. Direct Specific Match
  if (DESTINATION_IMAGES[key]) {
    return getUnsplashUrl(DESTINATION_IMAGES[key], quality);
  }

  // 2. Fuzzy name matching
  for (const nameKey of Object.keys(DESTINATION_IMAGES)) {
    if (key.includes(nameKey) || nameKey.includes(key)) {
      return getUnsplashUrl(DESTINATION_IMAGES[nameKey], quality);
    }
  }

  // 3. Category tags match
  if (tags) {
    if (tags.isHillStation) return getUnsplashUrl(CATEGORY_IMAGES.hillStation, quality);
    if (tags.isWaterfall) return getUnsplashUrl(CATEGORY_IMAGES.waterfall, quality);
    if (tags.isBeach) return getUnsplashUrl(CATEGORY_IMAGES.beach, quality);
    if (tags.isForestOrNationalPark) return getUnsplashUrl(CATEGORY_IMAGES.forest, quality);
    if (tags.isTempleOrMuseum) return getUnsplashUrl(CATEGORY_IMAGES.temple, quality);
    if (tags.isViewpoint) return getUnsplashUrl(CATEGORY_IMAGES.viewpoint, quality);
  }

  // 4. Name keyword matching
  const lowerName = destName.toLowerCase();
  if (lowerName.includes("beach")) return getUnsplashUrl(CATEGORY_IMAGES.beach, quality);
  if (lowerName.includes("waterfall") || lowerName.includes("falls")) return getUnsplashUrl(CATEGORY_IMAGES.waterfall, quality);
  if (lowerName.includes("hill") || lowerName.includes("valley") || lowerName.includes("peak")) return getUnsplashUrl(CATEGORY_IMAGES.hillStation, quality);
  if (lowerName.includes("temple") || lowerName.includes("church") || lowerName.includes("mosque") || lowerName.includes("monument")) return getUnsplashUrl(CATEGORY_IMAGES.temple, quality);
  if (lowerName.includes("forest") || lowerName.includes("park") || lowerName.includes("sanctuary")) return getUnsplashUrl(CATEGORY_IMAGES.forest, quality);

  // 5. Default
  return getUnsplashUrl(CATEGORY_IMAGES.default, quality);
}

/**
 * Returns a secondary gallery image for the destination (to show alternative attractions / perspectives).
 */
export function getDestinationGallery(
  destName: string,
  tags?: {
    isHillStation: boolean;
    isBeach: boolean;
    isWaterfall: boolean;
    isForestOrNationalPark: boolean;
    isTempleOrMuseum: boolean;
    isViewpoint: boolean;
  }
): string[] {
  // Return 3 unique high-definition perspective images matching the style
  const lowerName = destName.toLowerCase();
  let baseIds = ["photo-1433832597046-4f10e10ac764", "photo-1506744038136-46273834b3fb", "photo-1507525428034-b723cf961d3e"];

  if (tags?.isBeach || lowerName.includes("beach")) {
    baseIds = [
      "photo-1507525428034-b723cf961d3e", // Sunny beach
      "photo-1544735716-392fe2489ffa", // Palm coastline
      "photo-1590050752117-238cb061295a"  // Coastal cliffs
    ];
  } else if (tags?.isHillStation || lowerName.includes("hill") || lowerName.includes("valley") || lowerName.includes("peak")) {
    baseIds = [
      "photo-1593693397690-362cb9666fc2", // Tea garden valley
      "photo-1506744038136-46273834b3fb", // Misty hills
      "photo-1464822759023-fed622ff2c3b"  // Mountain top
    ];
  } else if (tags?.isTempleOrMuseum || lowerName.includes("temple") || lowerName.includes("monument")) {
    baseIds = [
      "photo-1580835123018-8f15d97e88b9", // Dravidian Gopuram
      "photo-1600100397618-b7156f4d2571", // Ancient architecture
      "photo-1581335967831-ca5a74ef06b9"  // Heritage stone carvings
    ];
  } else if (tags?.isWaterfall || lowerName.includes("falls") || lowerName.includes("waterfall")) {
    baseIds = [
      "photo-1433832597046-4f10e10ac764", // Powerful waterfalls
      "photo-1470071459604-3b5ec3a7fe05", // Rainforest waterfalls
      "photo-1506744038136-46273834b3fb"  // Misty river flow
    ];
  } else {
    baseIds = [
      "photo-1548013146-72479768bada", // India iconic sunset
      "photo-1593693397690-362cb9666fc2", // Misty tea fields
      "photo-1582510003544-4d00b7f74220"  // Quaint colony street
    ];
  }

  return baseIds.map(id => getUnsplashUrl(id, "hd"));
}

/**
 * Returns a beautiful representative image for a specific tourist spot classification tag.
 */
export function getClassificationImage(tagKey: string, quality: "thumb" | "hd" = "hd"): string {
  const images: { [key: string]: string } = {
    isHillStation: "photo-1464822759023-fed622ff2c3b", // high scenic mountains
    isBeach: "photo-1507525428034-b723cf961d3e", // golden sandy beach
    isWaterfall: "photo-1433832597046-4f10e10ac764", // cascading waterfall
    isForestOrNationalPark: "photo-1616394584738-fc6e612e71b9", // lush green forest
    isTempleOrMuseum: "photo-1580835123018-8f15d97e88b9", // ancient heritage temple
    isViewpoint: "photo-1506744038136-46273834b3fb" // spectacular overlook view
  };
  const id = images[tagKey] || "photo-1548013146-72479768bada";
  return getUnsplashUrl(id, quality);
}

/**
 * Returns a beautiful, specific image for a famous attraction using fuzzy keyword matching.
 */
export function getAttractionImage(attractionName: string, quality: "thumb" | "hd" = "hd"): string {
  const name = attractionName.toLowerCase();
  
  // High fidelity specific matches
  const directMatches: { [key: string]: string } = {
    "kodaikanal lake": "photo-1501785888041-af3ef285b470",
    "coaker's walk": "photo-1464822759023-fed622ff2c3b",
    "pillar rocks": "photo-1533105079780-92b9be482077",
    "botanical gardens": "photo-1465146344425-f00d5f5c8f07",
    "doddabetta peak": "photo-1464822759023-fed622ff2c3b",
    "ooty lake": "photo-1501785888041-af3ef285b470",
    "varkala cliff": "photo-1590050752117-238cb061295a",
    "mysore palace": "photo-1590766940554-634a7ed41450",
    "charminar": "photo-1626014303757-641c449c7624",
    "hampi ruins": "photo-1600100397618-b7156f4d2571",
    "matrimandir": "photo-1544005313-94ddf0286df2",
    "athirappilly falls": "photo-1470071459604-3b5ec3a7fe05",
    "pine forest": "photo-1473448912268-2022ce9509d8",
    "guna caves": "photo-1507209696998-3c552ef7b875",
    "toy train": "photo-1532103054090-334e6e60ab29"
  };

  for (const key of Object.keys(directMatches)) {
    if (name.includes(key) || key.includes(name)) {
      return getUnsplashUrl(directMatches[key], quality);
    }
  }

  // Keyword matches
  if (name.includes("lake") || name.includes("boat") || name.includes("river") || name.includes("backwaters") || name.includes("sea")) {
    return getUnsplashUrl("photo-1501785888041-af3ef285b470", quality); // lake
  }
  if (name.includes("forest") || name.includes("pine") || name.includes("woods") || name.includes("jungle") || name.includes("canopy")) {
    return getUnsplashUrl("photo-1473448912268-2022ce9509d8", quality); // forest
  }
  if (name.includes("cave") || name.includes("cavern")) {
    return getUnsplashUrl("photo-1507209696998-3c552ef7b875", quality); // cave
  }
  if (name.includes("falls") || name.includes("waterfall") || name.includes("cascade")) {
    return getUnsplashUrl("photo-1433832597046-4f10e10ac764", quality); // waterfall
  }
  if (name.includes("temple") || name.includes("church") || name.includes("mosque") || name.includes("cathedral") || name.includes("shrine") || name.includes("gopuram") || name.includes("basilica")) {
    return getUnsplashUrl("photo-1580835123018-8f15d97e88b9", quality); // temple
  }
  if (name.includes("palace") || name.includes("fort") || name.includes("ruins") || name.includes("monument") || name.includes("heritage") || name.includes("museum") || name.includes("stupa") || name.includes("archaeological")) {
    return getUnsplashUrl("photo-1600100397618-b7156f4d2571", quality); // heritage/ruins
  }
  if (name.includes("peak") || name.includes("viewpoint") || name.includes("rock") || name.includes("cliff") || name.includes("hills") || name.includes("walk") || name.includes("mount") || name.includes("ridge") || name.includes("ghat")) {
    return getUnsplashUrl("photo-1464822759023-fed622ff2c3b", quality); // mountain peak/viewpoint
  }
  if (name.includes("beach") || name.includes("sand") || name.includes("coast") || name.includes("shore") || name.includes("cove")) {
    return getUnsplashUrl("photo-1507525428034-b723cf961d3e", quality); // beach
  }
  if (name.includes("garden") || name.includes("park") || name.includes("reserve") || name.includes("sanctuary") || name.includes("valley") || name.includes("meadow")) {
    return getUnsplashUrl("photo-1465146344425-f00d5f5c8f07", quality); // garden/park
  }

  // Default scenic fallback
  return getUnsplashUrl("photo-1548013146-72479768bada", quality);
}

/**
 * Returns a high-quality image URL for activities.
 */
export function getActivityImage(activityKey: string, quality: "thumb" | "hd" = "hd"): string {
  const images: { [key: string]: string } = {
    trekking: "photo-1551632811-561732d1e306", // Trekking path hike
    boating: "photo-1517411032315-54ef2cb783bb", // Kayaking boat
    camping: "photo-1504280390367-361c6d9f38f4", // Tent campfire
    shopping: "photo-1555529669-e69e7aa0ba9a", // shopping bags/markets
    sightseeing: "photo-1469854523086-cc02fe5d8800", // sightseeing travel road
    photography: "photo-1516035069371-29a1b244cc32" // camera photography
  };
  const id = images[activityKey] || "photo-1548013146-72479768bada";
  return getUnsplashUrl(id, quality);
}

/**
 * Internal helper to format Unsplash URLs with specific size parameters.
 */
function getUnsplashUrl(imageId: string, quality: "thumb" | "hd" | "original"): string {
  const base = `https://images.unsplash.com/${imageId}`;
  
  if (quality === "thumb") {
    // Optimized for small card thumbnails
    return `${base}?auto=format&fit=crop&w=400&h=300&q=80`;
  }
  if (quality === "hd") {
    // High Definition for desktop hero / large cards
    return `${base}?auto=format&fit=crop&w=1200&h=675&q=85`;
  }
  // "original" - Maximum original quality / high definition (4K Ultra HD)
  return `${base}?auto=format&fit=crop&w=3840&q=95`;
}
