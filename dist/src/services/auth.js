"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const UserValidator_1 = __importDefault(require("../util/validators/UserValidator"));
function authToken(token) {
    console.log(`[AUTH] Attemping to auth user`);
    try {
        if (!token)
            return { auth: false, message: 'No token provided.', token: undefined };
        else if (!UserValidator_1.default.verifyToken(token)) {
            return ({ auth: false, message: 'Failed to authenticate token.', token: undefined });
        }
        console.log(`[AUTH] User authenticated`);
        // se tudo estiver ok gera um novo token e envia de volta pro usuário, salva no request para uso posterior
        console.log("[AUTH] Creating new token");
        const decodedToken = (0, jsonwebtoken_1.decode)(token);
        const id = decodedToken.id;
        token = (0, jsonwebtoken_1.sign)({ id: id }, String(process.env.ACCESSTOKENSECRET), { expiresIn: 60 });
        return ({ auth: true, message: "User authenticated", token: token });
    }
    catch (error) {
        console.error("[USERCONTROLLER] Failed");
        console.error(error);
        return ({ auth: false, message: "Error", token: undefined });
    }
}
exports.default = authToken;
