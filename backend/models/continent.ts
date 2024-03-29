import { Column, Entity, PrimaryColumn } from "typeorm";

// Country entity for the database
@Entity()
export class Continent {
    @PrimaryColumn({ type: 'varchar'})
    continent!: string;
}

export let continents: string[] = [
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