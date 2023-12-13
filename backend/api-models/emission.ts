import { Emission as DbEmission } from "models/emission";

export class Emission {
    co2: number;
    methane: number;
    nitrousOxide: number;
    totalGhg: number;

    public static fromDatabase(emission : DbEmission) : Emission {
        return {
            co2: emission.co2,
            methane: emission.methane,
            nitrousOxide: emission.nitrousOxide,
            totalGhg: emission.totalGhg
        };
    }
}