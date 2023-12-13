import { Record as DbRecord } from "../models/record";

export class General {
    id!: string;
    gdp?: number;
    population?: number;

    public static fromDatabase(general : DbRecord) : General {
        return {
            id: general.country,
            gdp: general.energy_per_gdp, //TODO missing in model
            population: general.population
        };
    }
}
