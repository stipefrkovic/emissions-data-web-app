import { Record as DbRecord } from "../models/record";

export class TempChange {
    shareOfTempChangeFromGhg?: number;
    tempChangeFromCO2?: number;
    tempChangeFromN2?: number;
    tempChangeFrom?: number;
    tempChangeFromCH4?: number;

    public static fromDatabase(tempChange : DbRecord) : TempChange {
        return {
            shareOfTempChangeFromGhg: tempChange.temperature_change_from_ghg,
            tempChangeFromCO2: tempChange.temperature_change_from_co2,
            tempChangeFromN2: tempChange.temperature_change_from_n2o,
            tempChangeFromCH4: tempChange.temperature_change_from_ch4
        };
    }
}