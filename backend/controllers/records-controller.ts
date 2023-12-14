import { Request, Response } from "express";
import { DataSource, Raw } from "typeorm";
import { plainToClass, plainToClassFromExist, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import Container from "typedi";
import { Paging, Filter, Order, jsonToCSV } from "./helper";
import { Record } from "../models/record";
import { Record as ApiRecord } from "../api-models/record";
import { General } from "../api-models/general";
import { Emission } from "../api-models/emission";
import { Energy } from "../api-models/energy";
import { TempChange } from "../api-models/tempChange";
import { Country } from "../api-models/country";
import { isContinent } from "../models/continents";

// TODO verify json and csv for ALL responses

export class RecordsController {

    public async getAllRecords(req: Request, res: Response): Promise <void> {
        const recordRepository = Container.get<DataSource>("database").getRepository(Record);
        const allRecords = await recordRepository.find({take: 400});
        console.log(allRecords);
        res.status(200);
        res.json(allRecords.map(General.fromDatabase));
        return;
    }

    public async getRecordAsync(req: Request<{ id: string, year: string }>, res: Response): Promise <void> {
        let record
        if((/^[A-Z]{3}$/).test(req.params.id)){
            record = await Container.get<DataSource>("database").getRepository(Record).findOneBy({
                year: Raw(c => `${c} = :year`, { year: req.params.year }),
                iso_code: Raw(c => `${c} = :iso`, { iso: req.params.id })
            });
        } else {
            record = await Container.get<DataSource>("database").getRepository(Record).findOneBy({
                year: Raw(c => `${c} = :year`, { year: req.params.year }),
                country: Raw(c => `${c} = :country`, { country: req.params.id })
            });
        }

        if(!record) {
            res.status(404);
            res.json({error: "Resource not found"});
            return;
        }
        
        res.json(General.fromDatabase(record));
        return;
    }
    
    public async getEmissionAsync(req: Request<{ id: string }>, res: Response): Promise <void> {
        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });

        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        query = filter.apply(query);

        if((/^[A-Z]{3}$/).test(req.params.id)){
            query.andWhere("record.iso_code = :iso", {
                iso: req.params.id,
            });
        } else {
            query.andWhere("record.country = :country", {
                    country: req.params.id,
            });
        }

        let records = await query.getMany();

        if(records.length==0){
            res.status(204);
            res.json();
        } else {
            res.json(records.map(Emission.fromDatabase));
        }
    }

    public async getTempChangeAsync(req: Request<{ continent: string}>, res: Response): Promise <void> {
        // TODO verify australia/ocenia in all places
        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });

        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        query = filter.apply(query);

        if (req.params.continent && isContinent(req.params.continent)){
            query.andWhere("record.country = :continent", {
                continent: req.params.continent,
            });
        } else {
            res.status(400);
            res.json({
                "error-message": "The request body has an invalid entry."
            });
            return;
        }

        let records = await query.getMany();

        console.log(records);

        if(!records) {
            res.status(204);
            res.send("List empty; no results");
            return;
        }

        let mappedRecords = records.map(TempChange.fromDatabase);

        let acceptHeader = req.headers['accept'];
        if (acceptHeader && acceptHeader.includes('text/csv')) {
            // csv response
            try {
                res.status(200)
                   .setHeader('Content-Type', 'text/csv')
                   .send(jsonToCSV(mappedRecords))
                   ;
            } catch (error) {
                console.log(error);
                res.status(500)
                   .send('Server error; no results, try again later')
                   ;
            }
            
        } else {
            // json response
            res.status(200)
               .json(mappedRecords)
               ;
        }
    }

    public async deleteRecordAsync(req: Request<{ id: string, year: string }>, res: Response): Promise <void> {
        const recordRepository = Container.get<DataSource>("database").getRepository(Record);
        let record
        if((/^[A-Z]{3}$/).test(req.params.id)){
            record = await recordRepository.findOneBy({
                year: Raw(c => `${c} = :year`, { year: req.params.year }),
                iso_code: Raw(c => `${c} = :iso`, { iso: req.params.id })
            });
        } else {
            record = await recordRepository.findOneBy({
                year: Raw(c => `${c} = :year`, { year: req.params.year }),
                country: Raw(c => `${c} = :country`, { country: req.params.id })
            });
        }

        if(!record) {
            res.status(404);
            res.json({error: "Resource not found"});
        } else {
            await recordRepository.delete([req.params.id, req.params.year]);
            res.json();
        }

        return;
    }

    public async updateRecordAsync(req: Request<{ id: string, year: string }, {}, ApiRecord>, res: Response): Promise <void> {
        const apiRecord = plainToClass(ApiRecord, req.body, { enableImplicitConversion: true });
        const validationResult = await validate(ApiRecord, { validationError: { target: false }});
        if(validationResult.length > 0) {
            res.status(400);
            res.json({ error: "Record validation error", details: validationResult });
            return;
        }
        
        let record
        const recordRepository = Container.get<DataSource>("database").getRepository(Record);
        if((/^[A-Z]{3}$/).test(req.params.id)){
            record = await recordRepository.findOneBy({
                year: Raw(c => `${c} = :year`, { year: req.params.year }),
                iso_code: Raw(c => `${c} = :iso`, { iso: req.params.id })
            });
        } else {
            record = await recordRepository.findOneBy({
                year: Raw(c => `${c} = :year`, { year: req.params.year }),
                country: Raw(c => `${c} = :country`, { country: req.params.id })
            });
        }

        if(!record) {
            res.status(404);
            res.json({error: "Resource not found"});
            return;
        }

        record.gdp = apiRecord.gdp ?? 0;
        record.population = apiRecord.population ?? 0;
    

        await recordRepository.save(record);
        res.json(ApiRecord.fromDatabase(record));
        return;
    }

    public async createRecordAsync(req: Request, res: Response): Promise <void> {
        // const apiRecord = plainToInstance(ApiRecord, req.body, { enableImplicitConversion: true });

        // const validationResult = await validate(apiRecord, { validationError: { target: false }});
        // if(validationResult.length > 0) {
        //     res.status(400);
        //     res.json({ error: "Record validation error", details: validationResult });
        //     return;
        // }

        // let record : Record = {
        //     country: apiRecord.country,
        //     year: apiRecord.year,
        //     iso_code: apiRecord.iso_code,
        //     population: apiRecord.population,
        //     gdp: apiRecord.gdp ?? 0,
        //     co2: apiRecord.co2 ?? 0,
        //     energy_per_capita: apiRecord.energyPerCapita ?? 0,
        //     energy_per_gdp: apiRecord.energyPerGdp ?? 0,
        //     methane: apiRecord.methane ?? 0,
        //     nitrous_oxide: apiRecord.nitrousOxide ?? 0,
        //     total_ghg: apiRecord.totalGhg ?? 0,
        //     share_of_temperature_change_from_ghg: apiRecord.shareOfTempChangeFromGhg ?? 0,
        //     temperature_change_from_co2: apiRecord.tempChangeFromCO2 ?? 0,
        //     temperature_change_from_n2o: apiRecord.tempChangeFromN2 ?? 0,
        //     temperature_change_from_ch4: apiRecord.tempChangeFromCH4 ?? 0
        // };

        // let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");

        // let existingCount;
        // if((/^[A-Z]{3}$/).test(req.params.id)){
        //     existingCount = await query.andWhere({
        //         year: Raw(c => `${c} = :year`, { year: req.params.year }),
        //         iso_code: Raw(c => `${c} = :iso`, { iso: req.params.id })
        //     }).getCount();
        // } else {
        //     existingCount = await query.andWhere({
        //         year: Raw(c => `${c} = :year`, { year: req.params.year }),
        //         country: Raw(c => `${c} = :country`, { country: req.params.id })
        //     }).getCount();
        // }
        

        // if(existingCount > 0) {
        //     res.status(409);
        //     res.json({ error: "Record with the same name already exists" });
        //     return;
        // }

        // const recordsRepository = Container.get<DataSource>("database").getRepository(Record);
        // let dbEntry = recordsRepository.create(record);
        // await recordsRepository.save(dbEntry);

        // res.json(dbEntry);
        // return;
    }

    public async getEnergyRecordsAsync(req: Request<{ year: string}, {}, ApiRecord>, res: Response): Promise <void> {
        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");

        if (req.params.year){
            query.andWhere("record.year = :year", {
                year: req.params.year,
            });
        } else {
            res.status(400);
            res.json({
                "error-message": "The request body has an invalid entry."
            });
            return;
        }

        const sortOrder = req.query['order-by'] == "descending" ? "DESC" : "ASC";
        query.orderBy('record.population', sortOrder);

        const batchSize = req.query['batch-size'] as unknown as number;
        const batchIndex = req.query['batch-index'] as unknown as number;
        const skipCount = (batchIndex - 1) * batchSize;
        query.skip(skipCount);
        query.take(batchSize);

        query.andWhere("record.iso_code != ''");

        let records = await query.getMany();

        if(!records) {
            res.status(204);
            res.send("List empty; no results");
            return;
        }

        let mappedRecords = records.map(Energy.fromDatabase);

        let acceptHeader = req.headers['accept'];
        if (acceptHeader && acceptHeader.includes('text/csv')) {
            // csv response
            try {
                res.status(200)
                   .setHeader('Content-Type', 'text/csv')
                   .send(jsonToCSV(mappedRecords))
                   ;
            } catch (error) {
                console.log(error);
                res.status(500)
                   .send('Server error; no results, try again later')
                   ;
            }
            
        } else {
            // json response
            res.status(200)
               .json(mappedRecords)
               ;
        }
    }
}