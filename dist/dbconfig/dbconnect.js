"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
exports.default = (0, typeorm_1.createConnection)({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "instagram",
    entities: [
        User_1.User
    ],
    synchronize: true,
    logging: false
}).then(() => { console.log("[DB] Connection to database successfull"); }).catch(error => console.log(error));
