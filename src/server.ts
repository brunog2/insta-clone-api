import express from 'express';
import cors from 'cors';
import dbconnect from './dbconfig/dbconnect';
import routes from './routes';
import cookieParser from "cookie-parser";

class Server {
    public app: express.Application;

    constructor() {
        console.log("[SERVER] Initializing Express instance");
        this.app = express();
        console.log("[SERVER] Initializing database connection");
        this.dbConnect();
        console.log("[SERVER] Initializing middlewares");
        this.middlewares();
        console.log("[SERVER] Initializing routes");
        this.routes();
    }

    private dbConnect() {
        dbconnect;
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(cors({credentials: true, origin: ["http://localhost:3000", "http://10.0.0.105:3000", "localhost:3333"] }));
        this.app.use(cookieParser());
    }

    private routes() {
        this.app.use(routes);
        this.app.get('/', (req, res) => {
            console.log(`[ROUTES] receiving request to '/'`);
            return res.send('You got it!');
        });
    }


    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('Error', (err: Object) => reject(err));
        })
    }

}

export default Server;