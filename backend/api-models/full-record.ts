import { IsISO31661Alpha3, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf, isEmpty, isNotEmpty } from "class-validator";
import { GeneralRecord } from "../models/general-record";
import { EmissionRecord } from "../models/emission-record";
import { TemperatureRecord } from "../models/temperature-record";
import { EnergyRecord } from "../models/energy-record";
import { Country } from "../models/country";
import { Continent } from "../models/continent";
import { Transform } from "class-transformer";

// 'Full' record class for the API/controller
export class ApiFullRecord {
    @IsString() @IsNotEmpty()
    country!: string;
    @IsInt() @Min(1900) @Max(1999)
    @Transform(o => parseInt(o.value))
    year!: number;
    @ValidateIf((o: any) => isNotEmpty(o.iso_code)) @IsString()  @IsISO31661Alpha3()
    @Transform(o => isEmpty(o.value) ? undefined : o.value)
    iso_code?: string;
    
    @IsOptional() @IsInt()
    @Transform(o => isEmpty(o.value) ? undefined : parseInt(o.value))
    gdp?: number;
    @IsOptional() @IsInt() @Min(0)
    @Transform(o => isEmpty(o.value) ? undefined : parseInt(o.value))
    population?: number;
    
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    co2?: number;
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    methane?: number;
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    nitrous_oxide?: number;
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    total_ghg?: number;
    
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    share_of_temperature_change_from_ghg?: number;
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    temperature_change_from_co2?: number;
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    temperature_change_from_n2o?: number;
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    temperature_change_from_ghg?: number;
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    temperature_change_from_ch4?: number;

    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    energy_per_capita?: number;
    @IsOptional() @IsNumber()
    @Transform(o => isEmpty(o.value) ? undefined : parseFloat(o.value))
    energy_per_gdp?: number;

    // 1-to-1 mapping between the variables, useful for CSV column reduction
    static variables = [
        "country",
        "year",
        "iso_code",
        "population",
        "gdp",
        "co2",
        "energy_per_capita",
        "energy_per_gdp",
        "methane",
        "nitrous_oxide",
        "share_of_temperature_change_from_ghg",
        "temperature_change_from_ch4",
        "temperature_change_from_co2",
        "temperature_change_from_ghg",
        "temperature_change_from_n2o",
        "total_ghg"
    ]

    // Creates a database general record
    toGeneralRecord(): GeneralRecord {
        let generalRecord : GeneralRecord = {
            country: this.country,
            year: this.year,
            gdp: isEmpty(this.gdp) ? undefined : this.gdp,
            population: isEmpty(this.population) ? undefined : this.population
        };
        return generalRecord;
    }

    // Creates a database emission record
    toEmissionRecord(): EmissionRecord {
        let emissionRecord : EmissionRecord = {
            country: this.country,
            year: this.year,
            co2: isEmpty(this.co2) ? undefined : this.co2,
            methane: isEmpty(this.methane) ? undefined : this.methane,
            nitrous_oxide: isEmpty(this.nitrous_oxide) ? undefined : this.nitrous_oxide,
            total_ghg: isEmpty(this.total_ghg) ? undefined : this.total_ghg
        };
        return emissionRecord;
    }

    // Creates a database temperature record
    toTemperatureRecord(): TemperatureRecord {
        let temperatureRecord : TemperatureRecord = {
            country: this.country,
            year: this.year,
            share_of_temperature_change_from_ghg: isEmpty(this.share_of_temperature_change_from_ghg) ? undefined : this.share_of_temperature_change_from_ghg,
            temperature_change_from_co2: isEmpty(this.temperature_change_from_co2) ? undefined : this.temperature_change_from_co2,
            temperature_change_from_n2o: isEmpty(this.temperature_change_from_n2o) ? undefined : this.temperature_change_from_n2o,
            temperature_change_from_ghg: isEmpty(this.temperature_change_from_ghg) ? undefined : this.temperature_change_from_ghg,
            temperature_change_from_ch4: isEmpty(this.temperature_change_from_ch4) ? undefined : this.temperature_change_from_ch4
        };
        return temperatureRecord;
    }

    // Creates a database energy record
    toEnergyRecord(): EnergyRecord {
        let energyRecord : EnergyRecord = {
            country: this.country,
            year: this.year,
            energy_per_capita: isEmpty(this.energy_per_capita) ? undefined : this.energy_per_capita,
            energy_per_gdp: isEmpty(this.energy_per_gdp) ? undefined : this.energy_per_gdp
        };
        return energyRecord;
    }

    // Creates a database country
    toCountry(): Country {
        let country: Country = {
            country: this.country,
            iso_code: this.iso_code!
        }
        return country;
    }

    // Creates a database continent
    toContinent(): Continent {
        let continent: Continent = {
            continent: this.country,
        }
        return continent;
    }
}