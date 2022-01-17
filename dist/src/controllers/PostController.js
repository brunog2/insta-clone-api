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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../services/auth"));
class PostController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'store'`);
            try {
                const { img_url, description, user_id } = req.body;
                console.log(img_url, description, user_id);
                const user = yield User_entity_1.User.findOne({ id: user_id });
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
                const { id } = req.body;
                let { token } = req.cookies;
                const post = yield Post_entity_1.Post.findOne({ relations: ['user'], where: { id } });
                console.log(post, post === null || post === void 0 ? void 0 : post.user.id);
                function deletePost(user_id) {
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log("[POSTCONTROLLER] Database query successfull");
                        if (!post) {
                            console.error("[POSTCONTROLLER] Post doesn't exist");
                            return res.status(404).json({ error: "post_does_not_exist" });
                        }
                        const sameUser = bcrypt_1.default.compareSync(post.user.id, user_id);
                        console.log(sameUser);
                        if (sameUser) {
                            yield Post_entity_1.Post.remove(post);
                            console.log("[POSTCONTROLLER] Database query successfull");
                            return res.json({ message: "Post deleted" }).status(200);
                        }
                        else {
                            return res.json({ error: "user_not_owner" }).status(401);
                        }
                    });
                }
                const tokenValid = (0, auth_1.default)(token);
                console.log("valid", tokenValid);
                if (tokenValid.auth) {
                    const decodedToken = (0, jsonwebtoken_1.decode)(token);
                    const userId = decodedToken.id;
                    deletePost(userId);
                }
                else {
                    return res.json(tokenValid);
                }
            }
            catch (error) {
                console.error("[POSTCONTROLLER] Failed", error);
                res.send(error).status(400);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'update'`);
            try {
                const { id, value } = req.body;
                let { token } = req.cookies;
                const { column } = req.body;
                const post = yield Post_entity_1.Post.findOne({ relations: ['user'], where: { id } });
                console.log(post, post === null || post === void 0 ? void 0 : post.user.id);
                console.log("[POSTCONTROLLER] Database query successfull");
                function updatePost(user_id) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!post) {
                            console.error("[POSTCONTROLLER] Post doesn't exist");
                            return res.status(400).json({ error: "post_does_not_exist" });
                        }
                        const sameUser = bcrypt_1.default.compareSync(post.user.id, user_id);
                        console.log(sameUser);
                        if (sameUser) {
                            post[column] = value;
                            yield Post_entity_1.Post.save(post);
                            console.log("[POSTCONTROLLER] Database query successfull");
                            return res.json({ message: "Post updated" }).status(200);
                        }
                        else {
                            return res.json(tokenValid);
                        }
                    });
                }
                const tokenValid = (0, auth_1.default)(token);
                console.log("valid", tokenValid);
                if (tokenValid.auth) {
                    const decodedToken = (0, jsonwebtoken_1.decode)(token);
                    const userId = decodedToken.id;
                    updatePost(userId);
                }
                else {
                    return res.json(tokenValid);
                }
            }
            catch (error) {
                console.error("[POSTCONTROLLER] Failed", error);
                res.status(400).send(error);
            }
        });
    }
}
exports.default = PostController;
