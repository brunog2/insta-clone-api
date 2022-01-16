"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_entity_1 = require("../entities/Post.entity");
const User_entity_1 = require("../entities/User.entity");
const axios_1 = __importDefault(require("axios"));
class PostController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'store'`);
            try {
                const { img_url, description, user_id } = req.body;
                console.log(img_url, description, user_id, parseInt(user_id));
                const user = yield User_entity_1.User.findOne({ id: parseInt(user_id) });
                if (!user) {
                    console.error("[POSTCONTROLLER] User doesn't exist");
                    return res.status(400).json({ error: "user_does_not_exist" });
                }
                let post = new Post_entity_1.Post();
                post.img_url = img_url;
                post.description = description;
                post.user = user;
                yield Post_entity_1.Post.save(post);
                console.log("[POSTCONTROLLER] Database query successfull");
                return res.status(200).json({ post });
            }
            catch (error) {
                console.error("[POSTCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'findAll'`);
            try {
                const posts = yield Post_entity_1.Post.find({
                    relations: ["user"],
                });
                console.log("[POSTCONTROLLER] Database query successfull");
                return res.status(200).json({ posts });
            }
            catch (error) {
                console.error("[POSTCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'delete'`);
            try {
                const { id, username, password } = req.body;
                function deletePost() {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const post = yield Post_entity_1.Post.find({ id });
                            console.log("[POSTCONTROLLER] Database query successfull");
                            if (!post) {
                                console.error("[POSTCONTROLLER] Post doesn't exist");
                                return res.status(400).json({ error: "post_does_not_exist" });
                            }
                            yield Post_entity_1.Post.remove(post);
                            console.log("[POSTCONTROLLER] Database query successfull");
                            return res.status(200);
                        }
                        catch (error) {
                            console.error("[POSTCONTROLLER] Failed");
                            return res.status(400).send(error);
                        }
                    });
                }
                axios_1.default.post("http://localhost:3333/login", { username, password }).then((response) => {
                    const { auth, error } = response.data;
                    if (auth) {
                        deletePost();
                    }
                    else
                        return res.json({ error });
                });
            }
            catch (error) {
                console.error("[POSTCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
}
exports.default = PostController;
