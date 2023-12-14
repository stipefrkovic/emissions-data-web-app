import { Record as DbRecord } from "../models/record";

export class Record {
    country!: string;
    year!: number;
    iso_code?: string;
    population?: number;
    gdp?: number;
    co2?: number;
    energyPerCapita?: number;
    energyPerGdp?: number;
    methane?: number;
    nitrousOxide?: number;
    totalGhg?: number;
    shareOfTempChangeFromGhg?: number;
    tempChangeFromGhg?: number;
    tempChangeFromCO2?: number;
    tempChangeFromN2?: number;
    tempChangeFromCH4?: number;


    public static fromDatabase(record : DbRecord) : Record {
        return {
            country: record.country,
            year: record.year,
            iso_code: record.iso_code,
            population: record.population,
            gdp: record.gdp,
            co2: record.co2,
            energyPerCapita: record.energy_per_capita,
            energyPerGdp: record.energy_per_gdp,
            methane: record.methane,
            nitrousOxide: record.nitrous_oxide,
            totalGhg: record.total_ghg,
            shareOfTempChangeFromGhg: record.share_of_temperature_change_from_ghg,
            tempChangeFromGhg: record.temperature_change_from_ghg,
            tempChangeFromCO2: record.temperature_change_from_co2,
            tempChangeFromN2: record.temperature_change_from_n2o,
            tempChangeFromCH4: record.temperature_change_from_ch4
        };
    }
}