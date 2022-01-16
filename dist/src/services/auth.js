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
const User_entity_1 = require("../entities/User.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
function authUser(column, value, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[AUTH] Attemping to auth user`);
        try {
            let user;
            const badField = () => {
                console.error("[AUTH] User not found");
                return { auth: false, error: "user_not_found" };
            };
            if (!password) {
                console.error("[AUTH] No password provided");
                return { auth: false, error: "password_required" };
            }
            column === "email" ? user = yield User_entity_1.User.findOne({ email: value }) :
                column === "phone_number" ? user = yield User_entity_1.User.findOne({ phone_number: value }) :
                    column === "username" ? user = yield User_entity_1.User.findOne({ username: value }) :
                        badField();
            console.log("[AUTH] Database query successfull");
            console.log(user);
            if (user) {
                bcrypt_1.default.compare(password, user["password"], (err, result) => {
                    if (result && user) {
                        return { auth: true, user_id: user["id"] };
                    }
                    else
                        return { auth: false, error: "invalid_credentials" };
                });
            }
            else
                badField();
        }
        catch (error) {
            console.error("[AUTH] Failed");
            return { auth: false, error };
        }
    });
}
exports.default = authUser;
