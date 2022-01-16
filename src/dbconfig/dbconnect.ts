import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from '../entities/User.entity';
import { Post } from '../entities/Post.entity';
import { Comment } from '../entities/Comment.entity';
import { Like } from '../entities/Like.entity';

export default createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "instagram",
    entities: [
        User, Post, Comment, Like
    ],
    synchronize: true,
    logging: false
}).then(() => { console.log("[DB] Connection to database successfull") }).catch(error => console.log(error));
