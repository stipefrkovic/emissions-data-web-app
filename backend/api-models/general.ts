import { Record as DbRecord } from "../models/record";

export class General {
    country!: string;
    year!: number;
    GDP?: number;
    population?: number;

    public static fromDatabase(general : DbRecord) : General {
        return {
            country: general.country,
            year: general.year,
            GDP: general.gdp,
            population: general.population
        };
    }
}
