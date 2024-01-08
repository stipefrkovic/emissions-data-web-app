import { Record as DbRecord } from "../models/record";

export class Record {
    country!: string;
    year!: number;
    iso_code?: string;
    population?: number;
    gdp?: number;
    co2?: number;
    energy_per_capita?: number;
    energy_per_gdp?: number;
    methane?: number;
    nitrous_oxide?: number;
    total_ghg?: number;
    share_of_temperature_change_from_ghg?: number;
    temperature_change_from_ch4?: number;
    temperature_change_from_co2?: number;
    temperature_change_from_ghg?: number;
    temperature_change_from_n2o?: number;


    public static fromDatabase(record : DbRecord) : Record {
        return {
            country: record.country,
            year: record.year,
            iso_code: record.iso_code,
            population: record.population,
            gdp: record.gdp,
            co2: record.co2,
            energy_per_capita: record.energy_per_capita,
            energy_per_gdp: record.energy_per_gdp,
            methane: record.methane,
            nitrous_oxide: record.nitrous_oxide,
            total_ghg: record.total_ghg,
            share_of_temperature_change_from_ghg: record.share_of_temperature_change_from_ghg,
            temperature_change_from_ch4: record.temperature_change_from_ch4,
            temperature_change_from_co2: record.temperature_change_from_co2,
            temperature_change_from_ghg: record.temperature_change_from_ghg,
            temperature_change_from_n2o: record.temperature_change_from_n2o,
        };
    }
}