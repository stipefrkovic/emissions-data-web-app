import { Request, Response } from "express";

export class RecordsController {
    public async getAllRecords(req: Request, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }
}