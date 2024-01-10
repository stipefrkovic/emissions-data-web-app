import { Request, Response } from "express";
import Papa from "papaparse";


// may throw error, call in try-catch block
export function jsonToCSV(data: any): string {
  let csv = Papa.unparse(data);
  return csv;
}
export function resourceConvertor(result: any, req: Request, res: Response) {
  let acceptHeader = req.headers['accept'];
  if (acceptHeader) {
    if (acceptHeader === 'text/csv') {
      try {
        res.setHeader('Content-Type', 'text/csv');
        res.send(jsonToCSV(result));
      } catch (error) {
        console.log(error);
        res.status(500);
        res.send('Server error; no results, try again later');
      }
      return;
    }
  }
  res.json(result);
}

export function isISOCode(id: string): boolean {
  return (/^[A-Z]{3}$/).test(id);
}

