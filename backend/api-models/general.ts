import { IsInt, IsNotEmpty, IsNumber, IsNumberString, IsString, isInt, isNotEmpty, isNumberString } from "class-validator";
import { Record as DbRecord } from "../models/record";

export class GeneralFull {
    @IsString() @IsNotEmpty()
    country!: string;
    @IsNumberString() @IsNotEmpty()
    year!: string;
    @IsInt() @IsNotEmpty()
    GDP?: number;
    @IsInt() @IsNotEmpty()
    population?: number;

    public static fromDatabase(general : DbRecord) : GeneralFull {
        return {
            country: general.country,
            year: general.year.toString(),
            GDP: general.gdp,
            population: general.population
        };
    }
}

export class General {
    @IsInt() @IsNotEmpty()
    GDP?: number;
    @IsInt() @IsNotEmpty()
    population?: number;

    public static fromDatabase(general : DbRecord) : General {
        return {
            GDP: general.gdp,
            population: general.population
        };
    }
}
