import { Request, Response } from "express";
import { DataSource, Raw, getConnection } from "typeorm";
import { plainToClass, plainToClassFromExist, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import Container from "typedi";
import { Paging, Filter, Order, jsonToCSV, CountrySelector, YearSelector, noResource, resourceConvertor, emptyList, ContinentSelector, invalidValidation, alreadyExists } from "./helper";
import { Record } from "../models/record";
import { Record as ApiRecord } from "../api-models/record";
import { General, GeneralFull } from "../api-models/general";
import { Emission } from "../api-models/emission";
import { Energy } from "../api-models/energy";
import { TempChange } from "../api-models/tempChange";
import { Country } from "../api-models/country";
import { Country as ModelCountry} from "../models/country"
import { isContinent } from "../models/continents";
import { GeneralRecord } from "../models/general-record";
import { EmissionRecord } from "../models/emission-record";
import { EnergyRecord } from "../models/energy-record";
import { TemperatureRecord } from "../models/temperature-record";
import { Continent } from "../models/continent";

// TODO verify json and csv for ALL responses
// TODO australia oceania
// difference between 404 and 204
// TODO responses in spec.yml and otherwise
// TODO countries and continents sql thing

export class RecordsController {

    public async createGeneralRecordAsync(req: Request, res: Response): Promise <void> {
        const generalFull = plainToInstance(GeneralFull, req.body, { enableImplicitConversion: true });
        let validationResult = await validate(generalFull, { validationError: { target: true }});
        if (invalidValidation(validationResult, res)) return;

        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
        const countrySelector = plainToClass(CountrySelector, req.body, { enableImplicitConversion: true });
        console.log(countrySelector);
        if (invalidValidation(await validate(countrySelector, { validationError: { target: true }}), res)) return;
        query = countrySelector.apply(query);

        const yearSelector = plainToClass(YearSelector, req.body, { enableImplicitConversion: true});
        console.log(yearSelector);
        if (invalidValidation(await validate(yearSelector, { validationError: { target: true }}), res)) return;
        query = yearSelector.apply(query);
        
        let recordsCount = await query.getCount();
        if (alreadyExists(recordsCount, res)) return;

        const repo = Container.get<DataSource>("database").getRepository(Record);

        let record : Record = {
            country: generalFull.country,
            year: parseInt(generalFull.year),
            population: generalFull.population,
            gdp: generalFull.GDP,
        };
        console.log(record);
        let dbEntry = repo.create(record);
        await repo.save(dbEntry);
        
        let mappedRecord = General.fromDatabase(dbEntry);

        res.status(201);
        resourceConvertor(mappedRecord, req, res);
        return;
    }

    public async getGeneralRecordAsync(req: Request<{ country: string, year: string }>, res: Response): Promise <void> {
        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
        const countrySelector = plainToClass(CountrySelector, req.params, { enableImplicitConversion: true });
        const yearSelector = plainToClass(YearSelector, req.params, { enableImplicitConversion: true});
        
        console.log(req.params);

        query = countrySelector.apply(query);
        query = yearSelector.apply(query);
        
        let record = await query.getOne();

        console.log(record);
        
        if (noResource(record, res)) return;

        let mappedRecord = General.fromDatabase(record!);

        res.status(200);
        resourceConvertor(mappedRecord, req, res);
    }

    public async updateGeneralRecordAsync(req: Request<{ country: string, year: string }, {}, ApiRecord>, res: Response): Promise <void> {        
        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
        const countrySelector = plainToClass(CountrySelector, req.params, { enableImplicitConversion: true });
        const yearSelector = plainToClass(YearSelector, req.params, { enableImplicitConversion: true});
        
        query = countrySelector.apply(query);
        query = yearSelector.apply(query);
        
        let record = await query.getOne();
        if (noResource(record, res)) return;

        record!.gdp = req.body.gdp;
        record!.population = req.body.population;
    
        const repo = Container.get<DataSource>("database").getRepository(Record);
        await repo.save(record!);
        
        res.status(200)
        let mappedRecord = General.fromDatabase(record!);
        resourceConvertor(mappedRecord, req, res);
        return;
    }

    public async deleteGeneralRecordAsync(req: Request<{ country: string, year: string }>, res: Response): Promise <void> {
        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
        const countrySelector = plainToClass(CountrySelector, req.params, { enableImplicitConversion: true });
        const yearSelector = plainToClass(YearSelector, req.params, { enableImplicitConversion: true});
        
        query = countrySelector.apply(query);
        query = yearSelector.apply(query);
        
        let record = await query.getOne();

        if (noResource(record, res)) return;

        const repo = Container.get<DataSource>("database").getRepository(Record);
        await repo.delete({country: req.params.country, year: parseInt(req.params.year)});

        res.status(204);
        res.json();
    }
    
    public async getEmissionAsync(req: Request<{ country: string }>, res: Response): Promise <void> {
        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });
        const countrySelector = plainToClass(CountrySelector, req.params, {enableImplicitConversion: true});
        
        query = filter.apply(query);
        query = countrySelector.apply(query);

        let records = await query.getMany();

        if (emptyList(records, res)) return;

        let mappedRecords = records.map(Emission.fromDatabase);

        res.status(200);
        resourceConvertor(mappedRecords, req, res);
    }

    public async getTempChangeAsync(req: Request<{ continent: string}>, res: Response): Promise <void> {
        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });
        const continentSelector = plainToClass(ContinentSelector, req.params, { enableImplicitConversion: true });

        query = filter.apply(query);
        try {
            query = continentSelector.apply(query);
        } catch (error) {
            res.status(400).json({ error: error});
            return;
        }

        let records = await query.getMany();

        if (emptyList(records, res)) return;

        let mappedRecords = records.map(TempChange.fromDatabase);

        res.status(200);
        resourceConvertor(mappedRecords, req, res);
    }

    public async getEnergyRecordsAsync(req: Request<{ year: string}, {}, ApiRecord>, res: Response): Promise <void> {
        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");

        const order = plainToClass(Order, req.query, { enableImplicitConversion: true });
        const yearSelector = plainToClass(YearSelector, req.params, { enableImplicitConversion: true});
        
        query = order.apply(query);
        query = yearSelector.apply(query);

        // TODO paging

        // const batchSize = req.query['batch-size'] as unknown as number;
        // const batchIndex = req.query['batch-index'] as unknown as number;
        // const skipCount = (batchIndex - 1) * batchSize;
        // query.skip(skipCount);
        // query.take(batchSize);

        // query.andWhere("record.iso_code != ''");

        let records = await query.getMany();

        if (emptyList(records, res)) return;

        let mappedRecords = records.map(Energy.fromDatabase);

        res.status(200);
        resourceConvertor(mappedRecords, req, res);
    }

    public async getCountriesAsync(req: Request, res: Response): Promise <void> {
        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });
        const order = plainToClass(Order, req.query, { enableImplicitConversion: true });

        query = order.apply(query);
        query = filter.apply(query);

        // query.andWhere("record.iso_code != ''");

        let records = await query.getMany();

        if (emptyList(records, res)) return;

        let mappedRecords = records.map(Country.fromDatabase);

        res.status(200);
        resourceConvertor(mappedRecords, req, res);
    }

    public async createRecordsAsync(req: Request, res: Response): Promise <void> {
        if (req.body.iso_code) {
            let generalRecord : GeneralRecord = {
                country: req.body.country,
                year: req.body.year,
                gdp: req.body.gdp ?? null,
                population: req.body.population ?? null,
            };
            console.log(generalRecord)
            let emissionRecord : EmissionRecord = {
                country: req.body.country,
                year: req.body.year,
                co2: req.body.co2 ?? null,
                methane: req.body.methane ?? null,
                nitrous_oxide: req.body.nitrous_oxide ?? null,
                total_ghg: req.body.total_ghg ?? null,
            };
            let energyRecord : EnergyRecord = {
                country: req.body.country,
                year: req.body.year,
                energy_per_capita: req.body.energy_per_capita ?? null,
                energy_per_gdp: req.body.energy_per_gdp ?? null,
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
                res.status(201);               
                resourceConvertor([savedGeneralRecord, savedEmissionRecord, savedEnergyRecord, savedCountry], 
                     req, 
                     res);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error saving record' });
            }
        } else {
            let temperatureRecord : TemperatureRecord = {
                continent: req.body.country,
                year: req.body.year,
                share_of_temperature_change_from_ghg: req.body.share_of_temperature_change_from_ghg ?? null,
                temperature_change_from_ch4: req.body.temperature_change_from_ch4 ?? null,
                temperature_change_from_co2: req.body.temperature_change_from_co2 ?? null,
                temperature_change_from_ghg: req.body.temperature_change_from_ghg ?? null,
                temperature_change_from_n2o: req.body.temperature_change_from_n2o ?? null,
            };
            let continent : Continent = {
                continent: req.body.country
            };
            try {
                const db = Container.get<DataSource>("database");
                const savedTemperatureRecord = await db.getRepository(TemperatureRecord).save(temperatureRecord);
                const savedContinent = await db.getRepository(Continent).save(continent);
                res.status(201);
                resourceConvertor([savedTemperatureRecord, savedContinent], req, res);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error saving record' });
            }
        }
    }

}