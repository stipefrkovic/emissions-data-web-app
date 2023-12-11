import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

class App {
    public app: express.Application;

    constructor() {
        this.app = express()

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