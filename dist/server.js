"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbconnect_1 = __importDefault(require("./dbconfig/dbconnect"));
const routes_1 = __importDefault(require("./routes"));
class Server {
    constructor() {
        this.start = (port) => {
            return new Promise((resolve, reject) => {
                this.app.listen(port, () => {
                    resolve(port);
                }).on('Error', (err) => reject(err));
            });
        };
        this.app = (0, express_1.default)();
        this.dbConnect();
        this.middlewares();
        this.routes();
    }
    dbConnect() {
        dbconnect_1.default;
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.use(routes_1.default);
        this.app.get('/', (req, res) => {
            console.log(`[ROUTES] receiving request to '/'`);
            return res.send('You got it!');
        });
    }
}
exports.default = Server;