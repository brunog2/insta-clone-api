"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "admin",
    "database": "instagram",
    "synchronize": true,
    "logging": false,
    "entities": [__dirname + '/../**/*.entity.js']
};
