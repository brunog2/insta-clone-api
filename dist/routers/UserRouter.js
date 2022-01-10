"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
console.log("nas rotas de usuario");
const router = (0, express_1.Router)();
const userController = new UserController_1.default();
router.post('/users', userController.store);
exports.default = router;
