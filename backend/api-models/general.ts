import { Record as DbRecord } from "../models/record";

export class General {
    id!: string;
    year!: number;
    gdp?: number;
    population?: number;

    public static fromDatabase(general : DbRecord) : General {
        return {
            id: general.country,
            year: general.year,
            gdp: general.gdp,
            population: general.population
        };
    }
}
