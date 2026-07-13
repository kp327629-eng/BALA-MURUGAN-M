/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TouristDestination } from "../types";

export const FALLBACK_DESTINATIONS: TouristDestination[] = [
  {
    id: "tn-kodaikanal",
    name: "Kodaikanal",
    state: "Tamil Nadu",
    district: "Dindigul",
    overview: "Nestled amidst the Palani Hills, Kodaikanal stands as the 'Gift of the Forest' with misty pine forests and cool breezes.",
    history: "Established in 1845 as a summer refuge from high plains temperatures by American Christian missionaries and British bureaucrats.",
    whyVisit: "Perfect mountain climate, magnificent viewing points, scenic row-boating, and fresh home-made chocolate factories.",
    famousAttractions: [
      "Kodaikanal Lake",
      "Coaker's Walk",
      "Bryant Park",
      "Pillar Rocks",
      "Pine Forest",
      "Guna Caves",
      "Silver Cascade Falls"
    ],
    tags: {
      isHillStation: true,
      isBeach: false,
      isWaterfall: true,
      isForestOrNationalPark: true,
      isTempleOrMuseum: false,
      isViewpoint: true
    },
    activities: {
      trekking: true,
      boating: true,
      camping: true,
      shopping: true
    },
    foodSpecialities: [
      "Homemade Chocolates",
      "Plums & Peaches",
      "Hot Masala Tea",
      "Fresh Pastries"
    ],
    shootingLocations: [
      "Guna Caves (Manjummel Boys)",
      "Pine Forest (Regional songs)"
    ],
    nearbyPlaces: [
      "Vattakanal",
      "Mannavanur Lake",
      "Berijam Lake"
    ],
    bestSeason: "October to March",
    climate: "Cool and misty (12°C - 20°C)",
    recommendedDuration: "3 Days, 2 Nights",
    safetyTips: [
      "Follow local administrative safety guidelines and timing warnings.",
      "Ensure group headcount is maintained before leaving key spots."
    ],
    travelDistanceKm: 450,
    baseBudget: {
      transportation: 1300,
      accommodation: 1560,
      food: 1040,
      entryTickets: 170,
      miscellaneous: 430
    }
  },
  {
    id: "tn-ooty",
    name: "Ooty",
    state: "Tamil Nadu",
    district: "The Nilgiris",
    overview: "Ooty, the 'Queen of Hill Stations', is situated in the high Nilgiri Hills, featuring heritage toy train lines and tea gardens.",
    history: "Developed as an administrative and holiday retreat by the British East India Company in the early 19th century.",
    whyVisit: "Spectacular sprawling tea estates, heritage mountain railway rides, botanical beauty, and vast lake boating experiences.",
    famousAttractions: [
      "Botanical Gardens",
      "Doddabetta Peak",
      "Ooty Lake",
      "Rose Garden",
      "Nilgiri Mountain Railway",
      "Pykara Falls"
    ],
    tags: {
      isHillStation: true,
      isBeach: false,
      isWaterfall: true,
      isForestOrNationalPark: true,
      isTempleOrMuseum: false,
      isViewpoint: true
    },
    activities: {
      trekking: true,
      boating: true,
      camping: false,
      shopping: true
    },
    foodSpecialities: [
      "Ooty Varkey",
      "Homemade Dark Chocolates",
      "Fresh Nilgiri Tea"
    ],
    shootingLocations: [
      "Botanical Gardens (Kuch Kuch Hota Hai)",
      "Pykara Lake (Regional films)"
    ],
    nearbyPlaces: [
      "Coonoor",
      "Kotagiri",
      "Mudumalai National Park"
    ],
    bestSeason: "March to June & September to November",
    climate: "Chilly and refreshing (10°C - 18°C)",
    recommendedDuration: "3 Days, 2 Nights",
    safetyTips: [
      "Follow local administrative safety guidelines and timing warnings.",
      "Ensure group headcount is maintained before leaving key spots."
    ],
    travelDistanceKm: 530,
    baseBudget: {
      transportation: 1350,
      accommodation: 1490,
      food: 980,
      entryTickets: 230,
      miscellaneous: 450
    }
  },
  {
    id: "tn-mahabalipuram",
    name: "Mahabalipuram",
    state: "Tamil Nadu",
    district: "Chengalpattu",
    overview: "A UNESCO World Heritage site known for its historic rock-cut Hindu temples, carvings, and beautiful seaside shore temples.",
    history: "An ancient port city of the Pallava dynasty during the 7th and 8th centuries, showcasing legendary architectural milestones.",
    whyVisit: "Exquisite stone sculptures, pristine coastal sea views, and rich cultural legacy suitable for archaeological groups.",
    famousAttractions: [
      "Shore Temple",
      "Five Rathas",
      "Arjuna's Penance",
      "Krishna's Butterball",
      "Mahabalipuram Beach"
    ],
    tags: {
      isHillStation: false,
      isBeach: true,
      isWaterfall: false,
      isForestOrNationalPark: false,
      isTempleOrMuseum: true,
      isViewpoint: true
    },
    activities: {
      trekking: false,
      boating: true,
      camping: false,
      shopping: true
    },
    foodSpecialities: [
      "Fresh Fish Fry",
      "Coconut Water",
      "Filter Coffee",
      "South Indian Meals"
    ],
    shootingLocations: [
      "Shore Temple Backgrounds (Many classic movies)"
    ],
    nearbyPlaces: [
      "Covelong Beach",
      "Chennai",
      "Kanchipuram"
    ],
    bestSeason: "November to February",
    climate: "Warm and coastal (22°C - 32°C)",
    recommendedDuration: "2 Days, 1 Night",
    safetyTips: [
      "Follow local administrative safety guidelines and timing warnings.",
      "Ensure group headcount is maintained before leaving key spots."
    ],
    travelDistanceKm: 60,
    baseBudget: {
      transportation: 500,
      accommodation: 1500,
      food: 1000,
      entryTickets: 100,
      miscellaneous: 400
    }
  },
  {
    id: "tn-madurai",
    name: "Madurai",
    state: "Tamil Nadu",
    district: "Madurai",
    overview: "One of the oldest continuously inhabited cities in the world, famous for the magnificent Meenakshi Amman Temple.",
    history: "Historically ruled by the Pandyan Kings, Madurai is deeply tied to Tamil literature Sangam assemblies and ancient trade routes.",
    whyVisit: "Legendary temple architecture, buzzing midnight food markets, and rich jasmine-scented streets.",
    famousAttractions: [
      "Meenakshi Amman Temple",
      "Thirumalai Nayakar Mahal",
      "Gandhi Memorial Museum",
      "Koodal Azhagar Temple"
    ],
    tags: {
      isHillStation: false,
      isBeach: false,
      isWaterfall: false,
      isForestOrNationalPark: false,
      isTempleOrMuseum: true,
      isViewpoint: false
    },
    activities: {
      trekking: false,
      boating: false,
      camping: false,
      shopping: true
    },
    foodSpecialities: [
      "Jigarthanda",
      "Parotta with Salna",
      "Idly with spicy chutneys"
    ],
    shootingLocations: [
      "Thirumalai Nayakar Mahal (Guru, Bombay)"
    ],
    nearbyPlaces: [
      "Alagar Kovil",
      "Kodaikanal",
      "Rameshwaram"
    ],
    bestSeason: "October to March",
    climate: "Warm and cultural (24°C - 35°C)",
    recommendedDuration: "2 Days, 1 Night",
    safetyTips: [
      "Follow local administrative safety guidelines and timing warnings.",
      "Ensure group headcount is maintained before leaving key spots."
    ],
    travelDistanceKm: 460,
    baseBudget: {
      transportation: 1350,
      accommodation: 1450,
      food: 1060,
      entryTickets: 150,
      miscellaneous: 480
    }
  },
  {
    id: "tn-rameshwaram",
    name: "Rameshwaram",
    state: "Tamil Nadu",
    district: "Ramanathapuram",
    overview: "A sacred island town separated from mainland India by the historic Pamban Channel, holding massive mythological value.",
    history: "Historically associated with Lord Rama's bridge building to Lanka, it is home to the Ramanathaswamy Temple with giant corridors.",
    whyVisit: "Stunning train journeys over the sea Pamban Bridge, sacred beach baths, and visiting the ghost town of Dhanushkodi.",
    famousAttractions: [
      "Ramanathaswamy Temple",
      "Agni Theertham",
      "Dhanushkodi Ghost Town",
      "Pamban Bridge",
      "APJ Abdul Kalam Memorial"
    ],
    tags: {
      isHillStation: false,
      isBeach: true,
      isWaterfall: false,
      isForestOrNationalPark: false,
      isTempleOrMuseum: true,
      isViewpoint: true
    },
    activities: {
      trekking: false,
      boating: true,
      camping: false,
      shopping: true
    },
    foodSpecialities: [
      "Sea Shell Crafts",
      "Traditional South Indian Thali",
      "Filter Coffee"
    ],
    shootingLocations: [
      "Pamban Bridge (Chennai Express, Kannathil Muthamittal)"
    ],
    nearbyPlaces: [
      "Kanyakumari",
      "Madurai",
      "Devipattinam"
    ],
    bestSeason: "October to March",
    climate: "Tropical coastal (23°C - 33°C)",
    recommendedDuration: "2 Days, 1 Night",
    safetyTips: [
      "Follow local administrative safety guidelines and timing warnings.",
      "Ensure group headcount is maintained before leaving key spots."
    ],
    travelDistanceKm: 560,
    baseBudget: {
      transportation: 1600,
      accommodation: 1400,
      food: 1000,
      entryTickets: 100,
      miscellaneous: 400
    }
  }
];
