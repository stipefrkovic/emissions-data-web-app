import { Record as DbRecord } from "../models/record";

export class Emission {
    co2?: number;
    methane?: number;
    nitrousOxide?: number;
    totalGhg?: number;

    public static fromDatabase(emission : DbRecord) : Emission {
        return {
            co2: emission.co2,
            methane: emission.methane,
            nitrousOxide: emission.nitrous_oxide,
            totalGhg: emission.share_of_temperature_change_from_ghg
        };
    }
}