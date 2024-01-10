import { NextFunction, Request, Response } from "express";
import { DataSource, Raw, getConnection } from "typeorm";
import { plainToClass, plainToClassFromExist, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import Container from "typedi";
import { Paging, YearSelector, EmissionCountrySelector, TemperatureYearFilter, ContinentSelector, EmissionYearFilter, GeneralCountrySelector, EnergyPopulationOrder, GeneralYearSelector, EnergyYearSelector, Batcher } from "./query";
import { resourceConvertor } from "./helper";
import { jsonToCSV } from "./helper";
import { alreadyExists } from "../error";
import { Record as ApiRecord } from "../api-models/record";
import { ApiFullGeneralRecord, ApiGeneralRecord } from "../api-models/general";
import { ApiEmissionRecord } from "../api-models/emission";
import { ApiEnergyRecord } from "../api-models/energy";
import { ApiTemperatureRecord } from "../api-models/temperature";
import { Country } from "../api-models/country";
import { Country as ModelCountry} from "../models/country"
import { isContinent } from "../models/continent";
import { GeneralRecord } from "../models/general-record";
import { EmissionRecord } from "../models/emission-record";
import { EnergyRecord } from "../models/energy-record";
import { TemperatureRecord } from "../models/temperature-record";
import { Continent } from "../models/continent";
import { badValidation } from "./validate";
import { emptyList, resourceNotFound } from "../error";

// TODO verify json and csv for ALL responses
// TODO australia oceania
// difference between 404 and 204
// TODO responses in spec.yml and otherwise
// TODO countries and continents sql thing

export class RecordsController {

    public async createGeneralRecordAsync(req: Request, res: Response, next: NextFunction): Promise <void> {
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

    public async updateGeneralRecordAsync(req: Request<{ country: string, year: string }, {}, ApiRecord>, res: Response, next: NextFunction): Promise <void> {                
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
        let emissionRecordQuery = Container.get<DataSource>("database").getRepository(EmissionRecord).createQueryBuilder("emission_record");
        
        const emissionYearFilter = plainToClass(EmissionYearFilter, req.query, { enableImplicitConversion: true });
        if (badValidation(await validate(emissionYearFilter, { validationError: { target: true }}), res, next)) return;
        
        const emissionCountrySelector = plainToClass(EmissionCountrySelector, req.params, {enableImplicitConversion: true});
        if (badValidation(await validate(emissionCountrySelector, { validationError: { target: true }}), res, next)) return;

        emissionRecordQuery = emissionYearFilter.apply(emissionRecordQuery);
        emissionRecordQuery = emissionCountrySelector.apply(emissionRecordQuery);

        let emissionRecords = await emissionRecordQuery.getMany();

        if (emptyList(emissionRecords, req, res)) return;

        let apiEmissionRecords = emissionRecords.map(ApiEmissionRecord.fromDatabase);

        res.status(200);
        resourceConvertor(apiEmissionRecords, req, res);
    }

    public async getTemperatureRecordAsync(req: Request<{ continent: string}>, res: Response, next: NextFunction): Promise <void> {
        let temperatureRecordQuery = Container.get<DataSource>("database").getRepository(TemperatureRecord).createQueryBuilder("temperature_record");
        
        const temperatureHigherYearFilter = plainToClass(TemperatureYearFilter, req.query, { enableImplicitConversion: true });
        if (badValidation(await validate(temperatureHigherYearFilter, { validationError: { target: true }}), res, next)) return;
        
        const continentSelector = plainToClass(ContinentSelector, req.params, {enableImplicitConversion: true});
        if (badValidation(await validate(continentSelector, { validationError: { target: true }}), res, next)) return;

        temperatureRecordQuery = temperatureHigherYearFilter.apply(temperatureRecordQuery);
        temperatureRecordQuery = continentSelector.apply(temperatureRecordQuery);

        let temperatureRecords = await temperatureRecordQuery.getMany();
        if (emptyList(temperatureRecords, req, res)) return;

        let apiTemperatureRecords = temperatureRecords.map(ApiTemperatureRecord.fromDatabase);

        res.status(200);
        resourceConvertor(apiTemperatureRecords, req, res);
    }

    public async getEnergyRecordsAsync(req: Request<{ year: string}, {}, ApiRecord>, res: Response, next: NextFunction): Promise <void> {
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
        if (emptyList(energyRecords, req, res)) return;

        let apiEnergyRecords = energyRecords.map(ApiEnergyRecord.fromDatabase);

        res.status(200);
        resourceConvertor(apiEnergyRecords, req, res);
    }

    // public async getCountriesAsync(req: Request, res: Response): Promise <void> {
    //     let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
    //     const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });
    //     const order = plainToClass(Order, req.query, { enableImplicitConversion: true });

    //     query = order.apply(query);
    //     query = filter.apply(query);

    //     // query.andWhere("record.iso_code != ''");

    //     let records = await query.getMany();

    //     if (emptyList(records, res)) return;

    //     let mappedRecords = records.map(Country.fromDatabase);

    //     res.status(200);
    //     resourceConvertor(mappedRecords, req, res);
    // }

    public async createRecordsAsync(req: Request, res: Response): Promise <void> {
        if (req.body.iso_code) {
            let generalRecord : GeneralRecord = {
                country: req.body.country,
                year: req.body.year,
                gdp: req.body.gdp == '' ? null : req.body.gdp ?? null,
                population: req.body.population == '' ? null : req.body.population ?? null,
            };
            let emissionRecord : EmissionRecord = {
                country: req.body.country,
                year: req.body.year,
                co2: req.body.co2 == '' ? null : req.body.co2 ?? null,
                methane: req.body.methane == '' ? null : req.body.methane ?? null,
                nitrous_oxide: req.body.nitrous_oxide == '' ? null : req.body.nitrous_oxide ?? null,
                total_ghg: req.body.total_ghg == '' ? null : req.body.total_ghg ?? null,
            };
            let energyRecord : EnergyRecord = {
                country: req.body.country,
                year: req.body.year,
                energy_per_capita: req.body.energy_per_capita == '' ? null : req.body.energy_per_capita ?? null,
                energy_per_gdp: req.body.energy_per_gdp == '' ? null : req.body.energy_per_gdp ?? null,
            };
            let country : ModelCountry = {
                country: req.body.country,
                iso_code: req.body.iso_code
            };
            try {
                const db = Container.get<DataSource>("database");
                const savedGeneralRecord = await db.getRepository(GeneralRecord).save(generalRecord);
                const savedEmissionRecord = await db.getRepository(EmissionRecord).save(emissionRecord);
                const savedEnergyRecord = await db.getRepository(EnergyRecord).save(energyRecord);
                const savedCountry = await db.getRepository(ModelCountry).save(country);
                res.status(201).json();               
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error saving record' });
            }
        } 
        if (isContinent(req.body.country)) {
            let temperatureRecord : TemperatureRecord = {
                continent: req.body.country,
                year: req.body.year,
                share_of_temperature_change_from_ghg: req.body.share_of_temperature_change_from_ghg == '' ? null : req.body.share_of_temperature_change_from_ghg ?? null,
                temperature_change_from_ch4: req.body.temperature_change_from_ch4 == '' ? null : req.body.temperature_change_from_ch4 ?? null,
                temperature_change_from_co2: req.body.temperature_change_from_co2 == '' ? null : req.body.temperature_change_from_co2 ?? null,
                temperature_change_from_ghg: req.body.temperature_change_from_ghg == '' ? null : req.body.temperature_change_from_ghg ?? null,
                temperature_change_from_n2o: req.body.temperature_change_from_n2o == '' ? null : req.body.temperature_change_from_n2o ?? null,
            };
            let continent : Continent = {
                continent: req.body.country
            };
            try {
                const db = Container.get<DataSource>("database");
                const savedTemperatureRecord = await db.getRepository(TemperatureRecord).save(temperatureRecord);
                const savedContinent = await db.getRepository(Continent).save(continent);
                res.status(201).json();
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error saving record' });
            }
        }
    }

}