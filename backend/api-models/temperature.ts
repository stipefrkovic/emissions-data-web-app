import { IsInt, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { TemperatureRecord } from "../models/temperature-record";

export class ApiTemperatureRecord {
    @IsInt() @IsNotEmpty() @Min(1900) @Max(1999)
    year!: number;
    @IsNumber()
    share_of_temperature_change_from_ghg?: number;
    @IsNumber()
    temperature_change_from_co2?: number;
    @IsNumber()
    temperature_change_from_n2o?: number;
    @IsNumber()
    temperature_change_from_ghg?: number;
    @IsNumber()
    temperature_change_from_ch4?: number;

    public static fromDatabase(temperatureRecord : TemperatureRecord) : ApiTemperatureRecord {
        let apiTemperatureRecord : ApiTemperatureRecord = {
            year: temperatureRecord.year,
            share_of_temperature_change_from_ghg: temperatureRecord.share_of_temperature_change_from_ghg,
            temperature_change_from_co2: temperatureRecord.temperature_change_from_co2,
            temperature_change_from_n2o: temperatureRecord.temperature_change_from_n2o,
            temperature_change_from_ghg: temperatureRecord.temperature_change_from_ghg,
            temperature_change_from_ch4: temperatureRecord.temperature_change_from_ch4
        };
        return apiTemperatureRecord;
    }
}