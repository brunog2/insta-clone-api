"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("./controllers/UserController"));
const router = (0, express_1.Router)();
const userController = new UserController_1.default();
router.get('/', (req, res) => {
    console.log(`[ROUTES] receiving type GET request to '/'`);
    return res.send('You got it!');
});
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/posts', userController.posts);
router.get('/users', userController.findAll);
router.post('/users', userController.store);
router.get('/users/:username', userController.findByUsername);
router.get('/users/email/:email', userController.findByEmail);
router.get('/users/phone/:phone_number', userController.findByPhone);
router.post('/users/delete', userController.delete);
router.post('/users/update', userController.update);
exports.default = router;
