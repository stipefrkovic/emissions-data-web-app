import { Record as DbRecord } from "../models/record";

export class Emission {
    id!: string;
    year!: number;
    co2?: number;
    methane?: number;
    nitrousOxide?: number;
    totalGhg?: number;

    public static fromDatabase(emission : DbRecord) : Emission {
        return {
            id: emission.country,
            year: emission.year,
            co2: emission.co2,
            methane: emission.methane,
            nitrousOxide: emission.nitrous_oxide,
            totalGhg: emission.total_ghg
        };
    }
}