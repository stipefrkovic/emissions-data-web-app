import express, {Application, Express, Request, Response} from 'express';
import morgan from "morgan";
import cors from "cors";
import * as bodyParser from 'body-parser';
import { MainRouter } from './routes/main-router';

class App {
    public app: Application;

    constructor() {
        this.app = express();

        // configure middleware
        this.configMiddleware();

        // configure routers
        (new MainRouter()).attach(this.app);
    }

    private configMiddleware(): void {
        this.app.use(cors());

        this.app.use(bodyParser.json());

        this.app.use(morgan('combined'));
    }
}

export default new App().app;