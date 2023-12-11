import { Request, Response } from "express";
import { DataSource, Raw } from "typeorm";
import { plainToClass, plainToClassFromExist, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import Container from "typedi";
import { Paging, Filter, Order } from "./helper";
import { Record } from "../models/record";
import { Record as ApiRecord } from "../api-models/record";
import { General } from "../api-models/general";
import { Emission } from "../api-models/emission";
import { Energy } from "../api-models/energy";
import { TempChange } from "../api-models/temp-change";
import { Country } from "../api-models/country";

export class RecordsController {
    public async getRecordAsync(req: Request<{ id: string, year: string }>, res: Response): Promise <void> {
        let record = await Container.get<DataSource>("database").getRepository(Record).findOneBy({
            id: Raw(c => `${c} = :id`, { id: req.params.id }),
            year: Raw(c => `${c} = :year`, { year: req.params.year })
        });

        if(!record) {
            res.status(404);
            res.json("");
            return;
        }
        
        res.json(General.fromDatabase(record));
        return;
    }

    public async createRecordAsync(req: Request, res: Response): Promise <void> {
        const apiRecord = plainToInstance(ApiRecord, req.body, { enableImplicitConversion: true });

        const validationResult = await validate(apiRecord, { validationError: { target: false }});
        if(validationResult.length > 0) {
            res.status(400);
            res.json({ error: "Record validation error", details: validationResult });
            return;
        }

        let record : Record = { //TODO: see exactly what we want to post
            name: apiRecord.name,
            year: apiRecord.year,
            GDP: apiRecord.GDP,
            population: apiRecord.population
        };

        const recordsRepository = Container.get<DataSource>("database").getRepository(Record);

        const existingCount = await recordsRepository
            .createQueryBuilder("record")
            .where("record.name = :name", { name: record.name }) //TODO: add name and year in one line
            .getCount();

        if(existingCount > 0) {
            res.status(409);
            res.json({ error: "Record already exists" });
            return;
        }

        let dbEntry = recordsRepository.create(record);
        await recordsRepository.save(dbEntry);

        res.json(dbEntry); //Not sure what this one could be

        return;
    }

    public async updateRecordAsync(req: Request<{ id: string, year: string }>, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }

    public async deleteRecordAsync(req: Request<{ id: string, year: string }>, res: Response): Promise <void> {
        const recordsRepository = Container.get<DataSource>("database").getRepository(Record);
        let record = await recordsRepository.findOneBy({
            id: Raw(c => `${c} = :id`, { id: req.params.id }),
            year: Raw(c => `${c} = :year`, { year: req.params.year })
        });
        
        if(!record) {
            res.status(404);
            res.json();
        } else {
            await recordsRepository.delete([req.params.id, req.params.year]); //TODO: double check if this works
            res.json();
        }

        return;
    }

    public async getEmissionAsync(req: Request<{ id: string }>, res: Response): Promise <void> {
        const apiRecord = plainToInstance(ApiRecord, req.body, { enableImplicitConversion: true,});
        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });

        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        query = filter.apply(query);

        let records = await Container.get<DataSource>("database") //TODO: needs some double checking when functional
            .getRepository(Record)
            .createQueryBuilder("record")
            .where("record.id IN (:...id)",{
                id: apiRecord.id?.map((a) => a.id),
            })
            .getMany();

        res.json(records.map(Emission.fromDatabase));
    }

    public async getTempChangeAsync(req: Request<{ continent: string}>, res: Response): Promise <void> {
        const apiRecord = plainToInstance(ApiRecord, req.body, { enableImplicitConversion: true,});
        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });

        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        query = filter.apply(query);

        let records = await Container.get<DataSource>("database") //TODO: needs some double checking when functional
            .getRepository(Record)
            .createQueryBuilder("record")
            .where("record.name IN (:...name)",{
                name: apiRecord.name?.map((a) => a.name),
            })
            .getMany();

        res.json(records.map(TempChange.fromDatabase));
    }

    public async getEnergyInYearAsync(req: Request<{ year: string}>, res: Response): Promise <void> {
        const apiRecord = plainToInstance(ApiRecord, req.body, { enableImplicitConversion: true,});

        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });
        const order = plainToClass(Order, req.query, { enableImplicitConversion: true });
        const paging = plainToClassFromExist(new Paging<Record>(), req.query, { enableImplicitConversion: true });

        let validationResult = await validate(paging, { validationError: { target: false }});
        if(validationResult.length > 0) {
            res.status(400);
            res.json({ error: "Invalid paging settings", details: validationResult });
            return;
        }

        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        query = filter.apply(query);
        query = order.apply(query);
        query = paging.apply(query);

        let records = await Container.get<DataSource>("database") //TODO: needs some double checking when functional
            .getRepository(Record)
            .createQueryBuilder("record")
            .where("record.year IN (:...year)",{
                name: apiRecord.year?.map((a) => a.year),
            })
            .getMany();

        res.json(records.map(Energy.fromDatabase));
    }

    public async getCountriesAsync(req: Request, res: Response): Promise <void> {
        const filter = plainToClass(Filter, req.query, { enableImplicitConversion: true });
        const order = plainToClass(Order, req.query, { enableImplicitConversion: true });
        const paging = plainToClassFromExist(new Paging<Record>(), req.query, { enableImplicitConversion: true });

        let validationResult = await validate(paging, { validationError: { target: false }});
        if(validationResult.length > 0) {
            res.status(400);
            res.json({ error: "Invalid paging settings", details: validationResult });
            return;
        }

        let query = Container.get<DataSource>("database").getRepository(Record).createQueryBuilder("record");
        query = filter.apply(query);
        query = order.apply(query);
        query = paging.apply(query);

        let records = await query.getMany();

        res.json(records.map(Country.fromDatabase));
    }
}