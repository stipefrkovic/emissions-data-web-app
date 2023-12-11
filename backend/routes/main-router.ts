import { Application } from "express";
import { IRouter } from "./irouter";
import { RecordsRouter } from "./records-router";


export class MainRouter implements IRouter {
    public attach(app: Application): void {
        (new RecordsRouter()).attach(app);
    }
}