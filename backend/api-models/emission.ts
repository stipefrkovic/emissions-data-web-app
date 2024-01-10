import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { Record as DbRecord } from "../models/record";
import { EmissionRecord } from "../models/emission-record";

export class ApiEmissionRecord {
    @IsInt() @IsNotEmpty() @Min(1900) @Max(1999)
    year!: number;
    @IsNumber()
    co2?: number;
    @IsNumber()
    methane?: number;
    @IsNumber()
    nitrous_oxide?: number;
    @IsNumber()
    total_ghg?: number;

    public static fromDatabase(emissionRecord : EmissionRecord) : ApiEmissionRecord {
        let apiEmissionRecord : ApiEmissionRecord = {
            year: emissionRecord.year,
            co2: emissionRecord.co2,
            methane: emissionRecord.methane,
            nitrous_oxide: emissionRecord.nitrous_oxide,
            total_ghg: emissionRecord.total_ghg
        };
        return apiEmissionRecord;
    }
}