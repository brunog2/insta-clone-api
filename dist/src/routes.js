"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("./controllers/UserController"));
const PostController_1 = __importDefault(require("./controllers/PostController"));
const router = (0, express_1.Router)();
const userController = new UserController_1.default();
const postController = new PostController_1.default();
router.get('/', (req, res) => {
    console.log(`[ROUTES] receiving type GET request to '/'`);
    return res.send('You got it!');
});
// user routes
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/:username/posts', userController.posts);
router.post('/feed', userController.feed);
router.get('/users', userController.findAll);
router.post('/users', userController.store);
router.get('/users/:username', userController.findByUsername);
router.get('/users/email/:email', userController.findByEmail);
router.get('/users/phone/:phone_number', userController.findByPhone);
router.post('/users/delete', userController.delete);
router.post('/users/update', userController.update);
// post routes
router.post('/post', postController.store);
router.get('/post', postController.findAll);
router.post('/posts/delete', postController.delete);
exports.default = router;
