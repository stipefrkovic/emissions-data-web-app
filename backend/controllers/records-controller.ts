import { Request, Response } from "express";
import { DataSource, Raw } from "typeorm";
import { plainToClass, plainToClassFromExist, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import Container from "typedi";
import { Paging, Filter, Order, jsonToCSV, CountrySelector, YearSelector, noResource, resourceConvertor, emptyList, ContinentSelector, invalidValidation, alreadyExists } from "./helper";
import { Record } from "../models/record";
import { Record as ApiRecord } from "../api-models/record";
import { General } from "../api-models/general";
import { Emission } from "../api-models/emission";
import { Energy } from "../api-models/energy";
import { TempChange } from "../api-models/tempChange";
import { Country } from "../api-models/country";
import { isContinent } from "../models/continents";

// TODO verify json and csv for ALL responses
// TODO australia oceania
// difference between 404 and 204
// TODO responses in spec.yml and otherwise
// TODO countries and continents sql thing

export class RecordsController {

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

        res.status(200);
        resourceConvertor(record, req, res);
    }

    public async createGeneralRecordAsync(req: Request, res: Response): Promise <void> {
        const apiRecord = plainToInstance(ApiRecord, req.body, { enableImplicitConversion: true });
        
        // const validationResult = await validate(apiRecord, { validationError: { target: false }});
        
        // if (invalidValidation(validationResult, res)) return;
        let record : Record = {
            country: apiRecord.country,
            year: apiRecord.year,
            iso_code: apiRecord.iso_code,
            population: apiRecord.population,
            gdp: apiRecord.gdp,
        };

        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        
        const countrySelector = plainToClass(CountrySelector, req.body, { enableImplicitConversion: true });
        const yearSelector = plainToClass(YearSelector, req.body, { enableImplicitConversion: true});
        
        query = countrySelector.apply(query);
        query = yearSelector.apply(query);
        
        let recordsCount = await query.getCount();
        if (alreadyExists(recordsCount, res)) return;

        const repo = Container.get<DataSource>("database").getRepository(Record);
        let dbEntry = repo.create(record);
        await repo.save(dbEntry);
        
        let message = {message: "General information succesfully created"}
        res.status(201);
        resourceConvertor(message, req, res);
        return;
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
        
        res.status(200).json(ApiRecord.fromDatabase(record!));
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
        let message = {message: "General info succesfully deleted"};
        res.send("cool");
        // resourceConvertor(message, req, res);
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
}