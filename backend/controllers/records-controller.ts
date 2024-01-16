import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import { plainToClass } from "class-transformer";
import { isDefined, isDivisibleBy, isEmpty, isNotEmpty, validate } from "class-validator";
import Container from "typedi";
import { EmissionCountrySelector, TemperatureYearFilter, TemperatureContinentSelector, EmissionYearFilter, GeneralCountrySelector, EnergyPopulationOrder, GeneralYearSelector, EnergyYearSelector, Batcher, PeriodSelector, CountryCountrySelector, emptyCountryCountryQuery, NumberSelector } from "./query";
import { csvToJson, resourceConvertor } from "./helper";
import { CustomError, alreadyExists } from "../error";
import { ApiFullGeneralRecord, ApiGeneralRecord } from "../api-models/general-record";
import { ApiEmissionRecord } from "../api-models/emission-record";
import { ApiEnergyRecord } from "../api-models/energy-record";
import { ApiTemperatureRecord } from "../api-models/temperature-record";
import { ApiCountry } from "../api-models/country";
import { Country} from "../models/country";
import { isContinent } from "../models/continent";
import { GeneralRecord } from "../models/general-record";
import { EmissionRecord } from "../models/emission-record";
import { EnergyRecord } from "../models/energy-record";
import { TemperatureRecord } from "../models/temperature-record";
import { Continent } from "../models/continent";
import { badValidation } from "./validate";
import { emptyList, resourceNotFound } from "../error";

import dataForge, { DataFrame, fromCSV } from 'data-forge';
import { ApiFullRecord } from "../api-models/full-record";

// TODO verify json and csv for ALL responses

// Controller for the records endpoint functions, 1-to-1 mapping to OpenAPI specification
export class RecordsController {

    public async createGeneralRecordAsync(req: Request, res: Response, next: NextFunction): Promise <void> {
        if (await emptyCountryCountryQuery(req.body, res, next)) return;
        
        const apiFullGeneralRecord : ApiFullGeneralRecord = plainToClass(ApiFullGeneralRecord, req.body, { enableImplicitConversion: true });

        let generaldRecordQuery = Container.get<DataSource>("database").getRepository(GeneralRecord).createQueryBuilder("general_record");
        
        const countrySelector = plainToClass(GeneralCountrySelector, req.body, { enableImplicitConversion: true });
        if (badValidation(await validate(countrySelector, { validationError: { target: true }}), res, next)) return;

        const yearSelector = plainToClass(GeneralYearSelector, req.body, { enableImplicitConversion: true});
        if (badValidation(await validate(yearSelector, { validationError: { target: true }}), res, next)) return;
        
        generaldRecordQuery = countrySelector.apply(generaldRecordQuery); 
        generaldRecordQuery = yearSelector.apply(generaldRecordQuery);
        
        console.log(countrySelector, yearSelector)
        let recordsCount = await generaldRecordQuery.getCount();
        if (alreadyExists(recordsCount, res)) return;

        const generaldRecordRepo = Container.get<DataSource>("database").getRepository(GeneralRecord);
        let generalRecord : GeneralRecord = ApiFullGeneralRecord.toDatabase(apiFullGeneralRecord)
        let dbEntry = generaldRecordRepo.create(generalRecord);
        await generaldRecordRepo.save(dbEntry);
        let apiGeneralRecord = ApiGeneralRecord.fromDatabase(dbEntry);

        const newResourceUrl = `${req.protocol}://${req.get('host')}/records/${generalRecord.country}/${generalRecord.year}/general`;
        res.setHeader('Location', newResourceUrl);

        res.status(201);
        resourceConvertor(apiGeneralRecord, req, res);
        return;
    }

    public async getGeneralRecordAsync(req: Request<{ country: string, year: string }>, res: Response, next: NextFunction): Promise <void> {
        if (await emptyCountryCountryQuery(req.params, res, next)) return;

        let generaldRecordQuery = Container.get<DataSource>("database").getRepository(GeneralRecord).createQueryBuilder("general_record");
        
        const countrySelector = plainToClass(GeneralCountrySelector, req.params, { enableImplicitConversion: true });
        if (badValidation(await validate(countrySelector, { validationError: { target: true }}), res, next)) return;

        const yearSelector = plainToClass(GeneralYearSelector, req.params, { enableImplicitConversion: true});
        if (badValidation(await validate(yearSelector, { validationError: { target: true }}), res, next)) return;
        
        generaldRecordQuery = countrySelector.apply(generaldRecordQuery); 
        generaldRecordQuery = yearSelector.apply(generaldRecordQuery);
        
        let generalRecord = await generaldRecordQuery.getOne();
        
        if (resourceNotFound(generalRecord, res, next)) return;

        let apiGeneralRecord = ApiGeneralRecord.fromDatabase(generalRecord!);

        res.status(200);
        resourceConvertor(apiGeneralRecord, req, res);
        return;
    }

    public async updateGeneralRecordAsync(req: Request<{ country: string, year: string }>, res: Response, next: NextFunction): Promise <void> {               
        if (await emptyCountryCountryQuery(req.params, res, next)) return;
        
        let generaldRecordQuery = Container.get<DataSource>("database").getRepository(GeneralRecord).createQueryBuilder("general_record");
        
        const countrySelector = plainToClass(GeneralCountrySelector, req.params, { enableImplicitConversion: true });
        if (badValidation(await validate(countrySelector, { validationError: { target: true }}), res, next)) return;

        const yearSelector = plainToClass(GeneralYearSelector, req.params, { enableImplicitConversion: true});
        if (badValidation(await validate(yearSelector, { validationError: { target: true }}), res, next)) return;
        
        generaldRecordQuery = countrySelector.apply(generaldRecordQuery); 
        generaldRecordQuery = yearSelector.apply(generaldRecordQuery);
        
        let generalRecord = await generaldRecordQuery.getOne();
        
        if (resourceNotFound(generalRecord, res, next)) return;

        let apiGeneralRecord : ApiGeneralRecord = plainToClass(ApiGeneralRecord, req.body, { enableImplicitConversion: true });
        generalRecord!.gdp = apiGeneralRecord.gdp;
        generalRecord!.population = apiGeneralRecord.population;
    
        const generaldRecordRepo = Container.get<DataSource>("database").getRepository(GeneralRecord);
        await generaldRecordRepo.save(generalRecord!);
        apiGeneralRecord = ApiGeneralRecord.fromDatabase(generalRecord!);
        
        res.status(200)
        resourceConvertor(apiGeneralRecord, req, res);
        return;
    }

    public async deleteGeneralRecordAsync(req: Request<{ country: string, year: string }>, res: Response, next: NextFunction): Promise <void> {
        if (await emptyCountryCountryQuery(req.params, res, next)) return;

        let generaldRecordQuery = Container.get<DataSource>("database").getRepository(GeneralRecord).createQueryBuilder("general_record");
        
        const countrySelector = plainToClass(GeneralCountrySelector, req.params, { enableImplicitConversion: true });
        if (badValidation(await validate(countrySelector, { validationError: { target: true }}), res, next)) return;

        const yearSelector = plainToClass(GeneralYearSelector, req.params, { enableImplicitConversion: true});
        if (badValidation(await validate(yearSelector, { validationError: { target: true }}), res, next)) return;
        
        generaldRecordQuery = countrySelector.apply(generaldRecordQuery); 
        generaldRecordQuery = yearSelector.apply(generaldRecordQuery);
        
        let generalRecord = await generaldRecordQuery.getOne();
        
        if (resourceNotFound(generalRecord, res, next)) return;

        const generaldRecordRepo = Container.get<DataSource>("database").getRepository(GeneralRecord);
        await generaldRecordRepo.delete({country: generalRecord!.country, year: generalRecord!.year});

        res.status(204).json();
        return;
    }
    
    public async getEmissionRecordAsync(req: Request<{ country: string }>, res: Response, next: NextFunction): Promise <void> {
        if (await emptyCountryCountryQuery(req.params, res, next)) return;

        let emissionRecordQuery = Container.get<DataSource>("database").getRepository(EmissionRecord).createQueryBuilder("emission_record");
        
        const emissionYearFilter = plainToClass(EmissionYearFilter, req.query, { enableImplicitConversion: true });
        if (badValidation(await validate(emissionYearFilter, { validationError: { target: true }}), res, next)) return;
        
        const emissionCountrySelector = plainToClass(EmissionCountrySelector, req.params, {enableImplicitConversion: true});
        if (badValidation(await validate(emissionCountrySelector, { validationError: { target: true }}), res, next)) return;

        emissionRecordQuery = emissionYearFilter.apply(emissionRecordQuery);
        emissionRecordQuery = emissionCountrySelector.apply(emissionRecordQuery);

        let emissionRecords = await emissionRecordQuery.getMany();

        console.log(emissionRecords);
        if (emptyList(emissionRecords, req, res, "Resource(s) not found")) return;

        let apiEmissionRecords = emissionRecords.map(ApiEmissionRecord.fromDatabase);

        res.status(200);
        resourceConvertor(apiEmissionRecords, req, res);
    }

    public async getTemperatureRecordAsync(req: Request<{ continent: string}>, res: Response, next: NextFunction): Promise <void> {
        let temperatureRecordQuery = Container.get<DataSource>("database").getRepository(TemperatureRecord).createQueryBuilder("temperature_record");
        
        const temperatureHigherYearFilter = plainToClass(TemperatureYearFilter, req.query, { enableImplicitConversion: true });
        if (badValidation(await validate(temperatureHigherYearFilter, { validationError: { target: true }}), res, next)) return;
        
        const continentSelector = plainToClass(TemperatureContinentSelector, req.params, {enableImplicitConversion: true});
        if (badValidation(await validate(continentSelector, { validationError: { target: true }}), res, next)) return;

        temperatureRecordQuery = temperatureHigherYearFilter.apply(temperatureRecordQuery);
        temperatureRecordQuery = continentSelector.apply(temperatureRecordQuery);

        let temperatureRecords = await temperatureRecordQuery.getMany();
        if (emptyList(temperatureRecords, req, res, "Resource(s) not found")) return;

        let apiTemperatureRecords = temperatureRecords.map(ApiTemperatureRecord.fromDatabase);

        res.status(200);
        resourceConvertor(apiTemperatureRecords, req, res);
    }

    public async getEnergyRecordsAsync(req: Request<{ year: string}>, res: Response, next: NextFunction): Promise <void> {
        let energyRecordQuery = Container.get<DataSource>("database").getRepository(EnergyRecord).createQueryBuilder("energy_record");

        const energyYearSelector = plainToClass(EnergyYearSelector, req.params, { enableImplicitConversion: true });
        if (badValidation(await validate(energyYearSelector, { validationError: { target: true }}), res, next)) return;

        const energyPopulationOrder = plainToClass(EnergyPopulationOrder, req.query, { enableImplicitConversion: true });
        if (badValidation(await validate(energyPopulationOrder, { validationError: { target: true }}), res, next)) return;

        const batcher = plainToClass(Batcher, req.query, { enableImplicitConversion: true });
        if (badValidation(await validate(batcher, { validationError: { target: true }}), res, next)) return;

        energyRecordQuery = energyYearSelector.apply(energyRecordQuery);
        energyRecordQuery = energyPopulationOrder.apply(energyRecordQuery);
        energyRecordQuery = batcher.apply(energyRecordQuery);

        let energyRecords = await energyRecordQuery.getMany()
        if (emptyList(energyRecords, req, res, "Resource(s) not found")) return;

        let apiEnergyRecords = energyRecords.map(ApiEnergyRecord.fromDatabase);

        res.status(200);
        resourceConvertor(apiEnergyRecords, req, res);
    }

    public async getCountriesAsync(req: Request, res: Response, next: NextFunction): Promise <void> {
        let temperatureRecordQuery = Container.get<DataSource>("database").getRepository(TemperatureRecord).createQueryBuilder("temperature_record");
        
        const periodSelector = plainToClass(PeriodSelector, req.query, { enableImplicitConversion: true });
        if (badValidation(await validate(periodSelector, { groups: [periodSelector.period_type], validationError: { target: true }}), res, next)) return;

        const numberSelector = plainToClass(NumberSelector, req.query, { enableImplicitConversion: true});
        if (badValidation(await validate(numberSelector, { validationError: { target: true }}), res, next)) return;

        temperatureRecordQuery = periodSelector.apply(temperatureRecordQuery);
        
        let order_dir : 'DESC' | 'ASC' = req.query.order_dir === 'DESC' ? 'DESC' : 'ASC';
        temperatureRecordQuery
            .orderBy(`total_temperature_change`, order_dir)
            .select('temperature_record.country AS country, SUM(temperature_record.share_of_temperature_change_from_ghg) AS total_temperature_change')
            .addSelect('(SELECT c.country FROM country c WHERE c.country = temperature_record.country)', 'actual_country')
            .groupBy('temperature_record.country')

        let countries = await temperatureRecordQuery.getRawMany();
        countries = countries.filter(x => (x.actual_country != null));

        if (emptyList(countries, req, res, "Resource(s) not found")) return;

        countries = numberSelector.apply(countries);

        let apiCountries = countries.map(ApiCountry.fromDatabase);

        res.status(200);
        resourceConvertor(apiCountries, req, res);
    }

    public async fillDatabaseAsync(req: Request, res: Response, next: NextFunction): Promise <void> {        
        let  emissionsCsvUrl : any = req.query.emissions_csv_url;
        if (isEmpty(emissionsCsvUrl)) {
            console.error(emissionsCsvUrl);
            const error = new CustomError("URL not provided", 400);
            next(error);
            return;
        }

        const emissionsResponse = await fetch(emissionsCsvUrl);
        if (!emissionsResponse.ok) {
            console.error(emissionsResponse);
            const error = new CustomError("Invalid response", 500);
            next(error);  
            return;    
        }

        const emissionsCsv = await emissionsResponse.text();
        let df : DataFrame = fromCSV(emissionsCsv);

        const keepColumns = ApiFullRecord.variables;
        let df2 = df.subset(keepColumns);
        
        const df3 = df2.where(row => parseInt(row.year) >= 1900 && parseInt(row.year) <= 1999);

        const df4 = df3.where(row => row.iso_code != '' || isContinent(row.country));
        
        const data = df4.toArray();

        const db = Container.get<DataSource>("database");

        console.log("Saving to database");
        
        for (let i = 0; i < data.length; i++) { 
            if (isDivisibleBy(i, 1000)) console.log(`Processing record ${i}`);
            
            const apiFullRecord : ApiFullRecord = plainToClass(ApiFullRecord, data[i], { enableImplicitConversion: false })
            
            if (badValidation(await validate(apiFullRecord, { validationError: { target: true }}), res, next)) {
                console.error(apiFullRecord); 
                return;
            }
            
            if (isNotEmpty(apiFullRecord.iso_code)) {
                try {
                    await db.getRepository(GeneralRecord).save(apiFullRecord.toGeneralRecord());
                    await db.getRepository(EmissionRecord).save(apiFullRecord.toEmissionRecord());
                    await db.getRepository(TemperatureRecord).save(apiFullRecord.toTemperatureRecord());
                    await db.getRepository(EnergyRecord).save(apiFullRecord.toEnergyRecord());
                    await db.getRepository(Country).save(apiFullRecord.toCountry());
                } catch (error) {
                    next(error);
                    return;
                }
            }
            
            if (isContinent(apiFullRecord.country)) {
                try {
                    await db.getRepository(TemperatureRecord).save(apiFullRecord.toTemperatureRecord());
                    await db.getRepository(Continent).save(apiFullRecord.toContinent());
                } catch (error) {
                    next(error);
                    return;
                }
            }
        }

        const newResourceUrl = `${req.protocol}://${req.get('host')}/records/`;
        res.setHeader('Location', newResourceUrl);
        
        res.status(201);
        const message = {message: `Succesfully created ${data.length} records`};
        resourceConvertor(message, req, res);
    }
}