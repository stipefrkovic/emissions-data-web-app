import apiCall from "./call";
import GeneralRecord from "../models/general";
import EmissionRecord from "../models/emission";
import EnergyRecord from "../models/energy";
import TempChangeRecord from "../models/temp-change";
import CountryRecord from "../models/country";

export default {
    async postGeneralRecord(
        country: string,
        year: number,
        GDP: number,
        population: number
    ){
        const data: Record<string, any> = {};
        if (country !== undefined) data.country = country;
        if (year !== undefined) data.year = year;
        if (GDP !== undefined) data.GDP = GDP;
        if (population !== undefined) data.population = population;

        const apiResponse = await apiCall(`records/general`, "GET", data);
        if (!apiResponse.ok) throw new Error(await apiResponse.text());

        return GeneralRecord.fromJson(await apiResponse.json());
    },

    async getGeneralRecord(country:string, year:string){
        const apiResponse = await apiCall(`records/${country}/${year}/general`, "GET");
        if (!apiResponse.ok) throw new Error(await apiResponse.text());

        return GeneralRecord.fromJson(await apiResponse.json());
    },

    async putGeneralRecord(
        country: string,
        year: number,
        GDP: number,
        population: number
    ){
        const data: Record<string, any> = {};
        if (country !== undefined) data.country = country;
        if (year !== undefined) data.year = year;
        if (GDP !== undefined) data.GDP = GDP;
        if (population !== undefined) data.population = population;

        const apiResponse = await apiCall(`records/general`, "PUT", data);
        if (!apiResponse.ok) throw new Error(await apiResponse.text());

        return GeneralRecord.fromJson(await apiResponse.json());
    }
        ,
    async deleteGeneralRecord(country:string, year:string){
        const apiResponse = await apiCall(`records/${country}/${year}/general`, "DELETE");
        if (!apiResponse.ok) throw new Error(await apiResponse.text());

        return GeneralRecord.fromJson(await apiResponse.json());
    },
    async getEmissionRecord(country: string, year?: string){
        const data: Record<string, any> = {};
        if (year !== undefined) {
            data.year = year;
        }

        const apiResponse = await apiCall(`records/${country}/emission`, "GET", data);
        if (!apiResponse.ok) throw new Error(await apiResponse.text());

        return EmissionRecord.fromJson(await apiResponse.json());
    },
    async getTempChangeRecord(continent:string, year?:string){
        const data: Record<string, any> = {};
        if (year !== undefined) {
            data.year = year;
        }

        const apiResponse = await apiCall(`records/${continent}/temp-change`, "GET", data);
        if (!apiResponse.ok) throw new Error(await apiResponse.text());

        return TempChangeRecord.fromJson(await apiResponse.json());
    },

    async getEnergyRecord(
        year: string,
        orderBy: string = "descending",
        batchSize: number = 10,
        batchIndex: number = 1
    ){
        const apiResponse = await apiCall(`records/${year}/energy`, "GET", {
            orderBy: orderBy,
            batchSize: batchSize,
            batchIndex: batchIndex
        });
        if (!apiResponse.ok) throw new Error(await apiResponse.text());

        return EnergyRecord.fromJson(await apiResponse.json());
    },
    async getCountryRecord(
        ncountries: number,
        orderBy: string = "share_of_temperature_change_from_ghg",
        order: string = "descending",
        periodType: string = "specific-year",
        periodValue: number
    ){
        const apiResponse = await apiCall(`records/countries`, "GET", {
            ncountries: ncountries,
            orderBy: orderBy,
            order: order,
            periodType: periodType,
            periodValue: periodValue
        });
        if (!apiResponse.ok) throw new Error(await apiResponse.text());

        return CountryRecord.fromJson(await apiResponse.json());
    }
};