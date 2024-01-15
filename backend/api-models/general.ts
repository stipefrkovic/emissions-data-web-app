import { IsISO31661Alpha3, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";
import { GeneralRecord } from "../models/general-record";

export class ApiFullGeneralRecord {
    @IsString() @IsNotEmpty()
    country!: string;
    
    @IsInt() @IsNotEmpty() @Min(1900) @Max(1999)
    year!: number;
    
    @IsString() @IsNotEmpty() @IsISO31661Alpha3()
    iso_code!: string;
    
    @IsInt()
    gdp?: number;
    
    @IsInt() @Min(0)
    population?: number;

    // public static fromDatabase(generalRecord: GeneralRecord, country: Country) : ApiFullGeneralRecord {
    //     return {
    //         country: generalRecord.country,
    //         year: generalRecord.year,
    //         iso_code: country.iso_code,
    //         gdp: generalRecord.gdp,
    //         population: generalRecord.population
    //     };
    // }

    public static toDatabase(apiFullGeneralRecord: ApiFullGeneralRecord) : GeneralRecord {
        let generalRecord : GeneralRecord = {
            country: apiFullGeneralRecord.country,
            year: apiFullGeneralRecord.year,
            gdp: apiFullGeneralRecord.gdp,
            population: apiFullGeneralRecord.population
        };
        return generalRecord;
    }
}

export class ApiGeneralRecord {
    @IsInt()
    gdp?: number;
    
    @IsInt() @Min(0)
    population?: number;

    public static fromDatabase(generalRecord: GeneralRecord) : ApiGeneralRecord {
        let apiGeneralRecord : ApiGeneralRecord = {
            gdp: generalRecord.gdp,
            population: generalRecord.population
        };
        return apiGeneralRecord;
    }
}
