import express from 'express';
import cors from 'cors';
import dbconnect from './dbconfig/dbconnect';
import routes from './routes';

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.dbConnect();
        this.middlewares();
        this.routes();
    }

    private dbConnect() {
        dbconnect;
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(cors());
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