import { Record as DbRecord } from "../models/record";

export class TempChange {
    continent!: string;
    year!: number;
    share_of_temperature_change_from_ghg?: number;
    temperature_change_from_co2?: number;
    temperature_change_from_n2o?: number;
    temperature_change_from_ghg?: number;
    temperature_change_from_ch4?: number;

    public static fromDatabase(tempChange : DbRecord) : TempChange {
        return {
            continent: tempChange.country,
            year: tempChange.year,
            share_of_temperature_change_from_ghg: tempChange.share_of_temperature_change_from_ghg,
            temperature_change_from_co2: tempChange.temperature_change_from_co2,
            temperature_change_from_n2o: tempChange.temperature_change_from_n2o,
            temperature_change_from_ghg: tempChange.temperature_change_from_ghg,
            temperature_change_from_ch4: tempChange.temperature_change_from_ch4
        };
    }
}