let continents: string[] = [
  'Africa',
  'Antarctica',
  'Asia',
  'Australia',
  'Europe',
  'North America',
  'South America'
];

export function isContinent(continent: string): boolean {
  return continents.includes(continent);
}