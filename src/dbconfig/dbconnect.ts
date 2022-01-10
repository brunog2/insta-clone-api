import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from '../entity/User';

export default createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "instagram",
    entities: [
        User
    ],
    synchronize: true,
    logging: false
}).then(() => { console.log("[DB] Connection to database successfull") }).catch(error => console.log(error));
