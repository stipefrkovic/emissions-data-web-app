import { Record as DbRecord } from "../models/record";

export class Emission {
    country!: string;
    year!: number;
    co2?: number;
    methane?: number;
    nitrous_oxide?: number;
    total_ghg?: number;

    public static fromDatabase(emission : DbRecord) : Emission {
        return {
            country: emission.country,
            year: emission.year,
            co2: emission.co2,
            methane: emission.methane,
            nitrous_oxide: emission.nitrous_oxide,
            total_ghg: emission.total_ghg
        };
    }
}