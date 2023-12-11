import { Request, Response } from "express";

export class RecordsController {
    public async getRecordAsync(req: Request<{ id: string, year: string }>, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }

    public async createRecordAsync(req: Request, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }

    public async updateRecordAsync(req: Request<{ id: string, year: string }>, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }

    public async deleteRecordAsync(req: Request<{ id: string, year: string }>, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }

    public async getEmissionAsync(req: Request<{ id: string }>, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }

    public async getTempChangeAsync(req: Request<{ continent: string}>, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }

    public async getEnergyInYearAsync(req: Request<{ year: string}>, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }

    public async getCountriesAsync(req: Request, res: Response): Promise <void> {
        res.status(200);
        res.json({error: "no error lol"})
        return;
    }
}