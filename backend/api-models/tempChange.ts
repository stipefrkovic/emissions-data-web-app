import { Record as DbRecord } from "../models/record";

export class TempChange {
    continent!: string;
    year!: number;
    shareOfTempChangeFromGhg!: number;
    tempChangeFromCO2!: number;
    tempChangeFromN2O!: number;
    tempChangeFromGHG!: number;
    tempChangeFromCH4!: number;

    public static fromDatabase(tempChange : DbRecord) : TempChange {
        return {
            continent: tempChange.country,
            year: tempChange.year,
            shareOfTempChangeFromGhg: tempChange.temperature_change_from_ghg,
            tempChangeFromCO2: tempChange.temperature_change_from_co2,
            tempChangeFromN2O: tempChange.temperature_change_from_n2o,
            tempChangeFromGHG: tempChange.temperature_change_from_ghg,
            tempChangeFromCH4: tempChange.temperature_change_from_ch4
        };
    }
}