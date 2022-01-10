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
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../entity/User");
const UserValidator_1 = __importDefault(require("../util/validators/UserValidator"));
class UserController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'store'`);
            try {
                var { full_name, email, phone_number, username, password } = req.body;
                // missing filled fields
                if (!(full_name || email || phone_number || username || password)) {
                    console.error('[USERCONTROLLER] Error: All fields are required');
                    return res.status(400).json({
                        error: 'all_fields_required'
                    });
                }
                const userValidator = new UserValidator_1.default();
                const user = new User_1.User();
                console.log('[USERCONTROLLER] Validating full name');
                // validating name
                if (!userValidator.nameValidator(full_name)) {
                    console.error('[USERCONTROLLER] Error: Invalid name');
                    return res.status(400).json({
                        error: 'invalid_name'
                    });
                }
                console.log('[USERCONTROLLER] Validating email');
                // validating email
                if (!userValidator.emailValidator(email)) {
                    console.error('[USERCONTROLLER] Error: Invalid email');
                    return res.status(400).json({
                        error: 'invalid_email!'
                    });
                }
                const emailInUse = yield User_1.User.findOne({ email });
                if (emailInUse) {
                    console.error('[USERCONTROLLER] Error: Email already in use');
                    return res.status(400).json({
                        error: 'email_already_in_use'
                    });
                }
                console.log('[USERCONTROLLER] Validating phone number');
                // validating phone number
                if (!userValidator.phoneValidator(phone_number)) {
                    console.error('[USERCONTROLLER] Error: Invalid phone number');
                    return res.status(400).json({
                        error: 'invalid_phone_number'
                    });
                }
                const phoneInUse = yield User_1.User.findOne({ phone_number });
                if (phoneInUse) {
                    console.error('[USERCONTROLLER] Error: Phone number already in use');
                    return res.status(400).json({
                        error: 'phone_number_already_in_use'
                    });
                }
                console.log('[USERCONTROLLER] Validating username');
                // validating username
                if (!userValidator.usernameValidator(username)) {
                    console.error('[USERCONTROLLER] Error: Invalid username');
                    return res.status(400).json({
                        error: 'invalid_username'
                    });
                }
                const usernameInUse = yield User_1.User.findOne({ username });
                if (usernameInUse) {
                    console.error('[USERCONTROLLER] Error: Username already in use');
                    return res.status(400).json({
                        error: 'username_already_in_use'
                    });
                }
                console.log('[USERCONTROLLER] Validating password');
                // validating password
                if (!userValidator.passwordValidator(username)) {
                    console.error('[USERCONTROLLER] Error: Invalid password');
                    return res.status(400).json({
                        error: 'invalid_password'
                    });
                }
                console.log('[USERCONTROLLER] All fields are valid');
                console.log('[USERCONTROLLER] Hashing password');
                bcrypt_1.default.hash(password, 10, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                    password = hash;
                    console.log(`[USERCONTROLLER] Password hashed`);
                    user.full_name = full_name;
                    user.email = email;
                    user.phone_number = phone_number;
                    user.username = username;
                    user.password = password;
                    yield user.save();
                    console.log("[USERCONTROLLER] Database query successfull");
                    return res.status(200).json({ user });
                }));
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    findByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findByUsername'`);
            try {
                const { username } = req.body = req.params;
                const users = yield User_1.User.findOne({ username });
                console.log("[USERCONTROLLER] Database query successfull");
                return res.status(200).json({ users });
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findAll'`);
            try {
                const users = yield User_1.User.find();
                console.log("[USERCONTROLLER] Database query successfull");
                return res.status(200).json({ users });
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'update'`);
            try {
                const { username, newValue } = req.body;
                const { column } = req.body;
                let user = yield User_1.User.findOne({ username });
                console.log("[USERCONTROLLER] Database query successfull");
                if (!user) {
                    console.error("[USERCONTROLLER] User doesn't exist");
                    return res.status(400).json({ error: "user_does_not_exist" });
                }
                // updating data on user object
                user[column] = newValue;
                yield User_1.User.save(user);
                console.log("[USERCONTROLLER] Database query successfull");
                return res.status(200).json({ user });
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'delete'`);
            try {
                const { username } = req.body;
                const user = yield User_1.User.find({ username });
                console.log("[USERCONTROLLER] Database query successfull");
                if (!user) {
                    console.error("[USERCONTROLLER] User doesn't exist");
                    return res.status(400).json({ error: "user_does_not_exist" });
                }
                yield User_1.User.remove(user);
                console.log("[USERCONTROLLER] Database query successfull");
                return res.status(200);
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
}
exports.default = UserController;
