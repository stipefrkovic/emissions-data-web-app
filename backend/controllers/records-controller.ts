import { Request, Response } from "express";
import { DataSource } from "typeorm";
import Container from "typedi";

import { Record } from "../models/record";

export class RecordsController {
    public async getAllRecords(req: Request, res: Response): Promise <void> {
        const recordRepository = Container.get<DataSource>("database").getRepository(Record);
        const allRecords = await recordRepository.find({take: 3});
        console.log(allRecords);
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }
}