import "reflect-metadata"
import { DataSource } from "typeorm";
import { config as dotenvConfig } from "dotenv";
import Container from "typedi";

import app from "./app";
import { Record } from "./models/record";


const PORT = process.env.PORT as unknown as number || 3000;
const HOST = process.env.HOST || "localhost";


const database = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT as unknown as number || 5432,
    username: "postgres",
    password: "postgres",
    database: process.env.DATABASE_NAME,
    entities: [
        Record
    ],
    synchronize: false,
    logging: false
})

database.initialize().then(database => {
    Container.set<DataSource>("database", database);
    app.listen(PORT, HOST, () => console.log(`Backend server listening on port ${PORT}`));
}).catch(console.log)

