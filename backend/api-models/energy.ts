import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Record as DbRecord } from "../models/record";
import { EnergyRecord } from "../models/energy-record";

export class ApiEnergyRecord {
    @IsString() @IsNotEmpty()
    country!: string;
    @IsNumber()
    energy_per_capita?: number;
    @IsNumber()
    energy_per_gdp?: number;

    public static fromDatabase(energyRecord : EnergyRecord) : ApiEnergyRecord {
        let apiEnergyRecord : ApiEnergyRecord = {
            country: energyRecord.country,
            energy_per_capita: energyRecord.energy_per_capita,
            energy_per_gdp: energyRecord.energy_per_gdp
        };
        return apiEnergyRecord;
    }
}