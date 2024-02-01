import { Request, Response } from "express";
import Papa from "papaparse";


// Self-describing, may throw error
export function jsonToCSV(data: any): string {
  let csv = Papa.unparse(data);
  return csv;
}

// Self-describing, may throw error
export function csvToJson(data: string): any {
  let json = Papa.parse(data);
  return json;
}

// Converts resource into JSON or CSV representation
export function resourceConvertor(result: any, req: Request, res: Response) {
  let acceptHeader = req.headers['accept'];
  if (acceptHeader) {
    if (acceptHeader === 'text/csv') {
      try {
        res.setHeader('Content-Type', 'text/csv');
        res.send(jsonToCSV(result));
      } catch (error) {
        console.error(error);
        res.status(500);
        res.send('Server error; no results, try again later');
      }
      return;
    }
  }
  res.json(result);
}