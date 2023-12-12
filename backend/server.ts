// import "reflect-metadata"
import { DataSource } from "typeorm";
import { config as dotenvConfig } from "dotenv";
import Container from "typedi";

import app from "./app";
import { Record } from "./models/record";

const PORT = process.env.PORT as unknown as number || 3000;
const HOST = process.env.HOST || "localhost";

const database = new DataSource({
    type: "mysql",
    host: "mariadb",
    port: 3306,
    username: "mariadb",
    password: "mariadb",
    database: "emissions",
    entities: [
        Record
    ],
    synchronize: false,
    logging: false
});

database.initialize().then(database => {
    Container.set<DataSource>("database", database);
    app.listen(PORT, HOST, () => console.log(`Backend server listening on port ${PORT}`));
}).catch(console.log)

