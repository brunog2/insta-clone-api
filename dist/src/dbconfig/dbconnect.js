"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_entity_1 = require("../entities/User.entity");
const Post_entity_1 = require("../entities/Post.entity");
const Comment_entity_1 = require("../entities/Comment.entity");
const Like_entity_1 = require("../entities/Like.entity");
exports.default = (0, typeorm_1.createConnection)({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "instagram",
    entities: [
        User_entity_1.User, Post_entity_1.Post, Comment_entity_1.Comment, Like_entity_1.Like
    ],
    synchronize: true,
    logging: false
}).then(() => { console.log("[DB] Connection to database successfull"); }).catch(error => console.log(error));
