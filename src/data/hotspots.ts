export type Category = 'Ocean' | 'Land' | 'River' | 'Coastal';
export type Severity = 'Very High' | 'High' | 'Moderate' | 'Low';

export interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: Category;
  severity: Severity;
  cause: string;
  fact: string;
  solution: string;
}

export interface DemoPoint {
  lat: number;
  lng: number;
  weight: number;
}

export const severityColors: Record<Severity, string> = {
  'Very High': '#ff5c66',
  High: '#ffad55',
  Moderate: '#f1de6e',
  Low: '#5be2a0',
};

const locations: [string, string, number, number, Category][] = [
  ['pacific-n', 'North Pacific', 32, -145, 'Ocean'],
  ['pacific-s', 'South Pacific', -27, -120, 'Ocean'],
  ['atlantic-n', 'North Atlantic', 28, -45, 'Ocean'],
  ['atlantic-s', 'South Atlantic', -28, -15, 'Ocean'],
  ['indian', 'Indian Ocean', -12, 78, 'Ocean'],
  ['med', 'Mediterranean Sea', 36, 18, 'Ocean'],
  ['caribbean', 'Caribbean Sea', 17, -75, 'Ocean'],
  ['arctic', 'Arctic Ocean', 78, 40, 'Ocean'],
  ['southern', 'Southern Ocean', -59, 70, 'Ocean'],
  ['tasman', 'Tasman Sea', -35, 162, 'Ocean'],
  ['north-sea', 'North Sea', 56, 3, 'Ocean'],
  ['arabian', 'Arabian Sea', 14, 62, 'Ocean'],
  ['ganges', 'Ganges River Basin', 25.3, 83, 'River'],
  ['yangtze', 'Yangtze River', 30.7, 117.5, 'River'],
  ['mekong', 'Mekong River', 15, 105.8, 'River'],
  ['nile', 'Nile River', 29.5, 31.2, 'River'],
  ['amazon', 'Amazon River', -3.1, -60, 'River'],
  ['mississippi', 'Mississippi River', 32, -91, 'River'],
  ['danube', 'Danube River', 44.8, 20.5, 'River'],
  ['niger', 'Niger River', 9.8, 5.2, 'River'],
  ['murray', 'Murray River', -35.1, 143.5, 'River'],
  ['jakarta', 'Jakarta Coast', -6.1, 106.8, 'Coastal'],
  ['manila', 'Manila Bay', 14.6, 120.8, 'Coastal'],
  ['mumbai', 'Mumbai Coast', 19, 72.8, 'Coastal'],
  ['lagos', 'Lagos Coast', 6.4, 3.4, 'Coastal'],
  ['california', 'California Coast', 34, -119, 'Coastal'],
  ['rio', 'Rio de Janeiro Coast', -22.9, -43.2, 'Coastal'],
  ['cape-town', 'Cape Town Coast', -33.9, 18.4, 'Coastal'],
  ['sydney', 'Sydney Coast', -33.9, 151.3, 'Coastal'],
  ['tokyo', 'Tokyo Bay', 35.5, 139.8, 'Coastal'],
  ['barcelona', 'Barcelona Coast', 41.3, 2.2, 'Coastal'],
  ['auckland', 'Auckland Coast', -36.8, 174.8, 'Coastal'],
  ['delhi', 'Delhi', 28.6, 77.2, 'Land'],
  ['london', 'London', 51.5, -0.1, 'Land'],
  ['paris', 'Paris', 48.9, 2.4, 'Land'],
  ['new-york', 'New York', 40.7, -74, 'Land'],
  ['mexico-city', 'Mexico City', 19.4, -99.1, 'Land'],
  ['sao-paulo', 'Sao Paulo', -23.6, -46.6, 'Land'],
  ['nairobi', 'Nairobi', -1.3, 36.8, 'Land'],
  ['johannesburg', 'Johannesburg', -26.2, 28, 'Land'],
  ['beijing', 'Beijing', 39.9, 116.4, 'Land'],
  ['bangkok', 'Bangkok', 13.8, 100.5, 'Land'],
  ['melbourne', 'Melbourne', -37.8, 145, 'Land'],
  ['vancouver', 'Vancouver', 49.3, -123.1, 'Land'],
];

const scenarios: Record<Category, { cause: string; solution: string }> = {
  Ocean: {
    cause: 'Demo scenario: floating packaging, plastic fragments and discarded fishing gear.',
    solution: 'Reduce plastic leakage on land and collect discarded fishing gear.',
  },
  Land: {
    cause: 'Demo scenario: discarded packaging, uncollected litter and open waste disposal.',
    solution: 'Improve waste collection, sorting and reusable packaging.',
  },
  River: {
    cause: 'Demo scenario: litter carried by runoff into a river corridor.',
    solution: 'Collect litter upstream and improve waste services along waterways.',
  },
  Coastal: {
    cause: 'Demo scenario: shoreline litter and packaging carried through drains.',
    solution: 'Prevent storm-drain litter and organize shoreline waste collection.',
  },
};

const severities: Severity[] = ['Very High', 'High', 'Moderate', 'Low'];

// These assignments are deliberately synthetic, not rankings of real places.
export const hotspots: Hotspot[] = locations.map(([id, name, lat, lng, category], index) => ({
  id, name, lat, lng, category,
  severity: severities[(index * 7) % severities.length],
  ...scenarios[category],
  fact: 'The color, density and extent of this cluster are simulated. They do not represent measured pollution at this location.',
}));

export function createDemoPoints(locationsToShow: Hotspot[]): DemoPoint[] {
  const spread: Record<Category, number> = { Ocean: 5, Land: 0.8, River: 0.3, Coastal: 0.5 };
  const weights: Record<Severity, number> = { 'Very High': 4, High: 3, Moderate: 2, Low: 1 };
  return locationsToShow.flatMap(location => {
    let seed = Array.from(location.id).reduce((value, char) => value * 31 + char.charCodeAt(0), 1) >>> 0;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    return Array.from({ length: 110 }, () => {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * spread[location.category];
      const lat = Math.max(-87, Math.min(87, location.lat + Math.sin(angle) * radius));
      const longitudeScale = Math.max(0.25, Math.cos(location.lat * Math.PI / 180));
      const lng = ((location.lng + Math.cos(angle) * radius / longitudeScale + 540) % 360) - 180;
      return { lat, lng, weight: weights[location.severity] * (1 - radius / spread[location.category] * 0.6) };
    });
  });
}
