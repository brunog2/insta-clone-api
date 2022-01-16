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
const jsonwebtoken_1 = require("jsonwebtoken");
const User_entity_1 = require("../entities/User.entity");
const UserValidator_1 = __importDefault(require("../util/validators/UserValidator"));
class UserController {
    posts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'posts'`);
            try {
                let { token } = req.cookies;
                console.log(`[USERCONTROLLER] User coookies`, req.cookies);
                if (!token)
                    return res.status(401).json({ auth: false, message: 'No token provided.' });
                else if (!UserValidator_1.default.verifyToken(token)) {
                    return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
                }
                const decodedToken = (0, jsonwebtoken_1.decode)(token);
                const id = decodedToken.id;
                console.log(`[USERCONTROLLER] User '${id}' authenticated`);
                const user = yield User_entity_1.User.findOne({ id });
                console.log(user);
                // se tudo estiver ok gera um novo token e envia de volta pro usuário, salva no request para uso posterior
                console.log("[USERCONTROLLER] Creating new token");
                token = (0, jsonwebtoken_1.sign)({ id: id }, String(process.env.ACCESSTOKENSECRET), { expiresIn: 60 });
                // armazenar o hash do token no browser como um HttpOnly cookie
                return res.cookie('token', token, { httpOnly: true }).json({ auth: true, accessToken: token, user }).status(200);
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'login'`);
            try {
                const { email, phone_number, username, password } = req.body;
                let user;
                const badField = () => {
                    console.error("[USERCONTROLLER] User not found");
                    return res.json({ error: "user_not_found" });
                };
                if (!password) {
                    console.error("[USERCONTROLLER] No password provided");
                    return res.json({ error: "password_required" });
                }
                email ? user = yield User_entity_1.User.findOne({ email }) :
                    phone_number ? user = yield User_entity_1.User.findOne({ phone_number }) :
                        username ? user = yield User_entity_1.User.findOne({ username }) :
                            badField();
                console.log("[USERCONTROLLER] Database query successfull");
                console.log(user);
                if (user) {
                    bcrypt_1.default.compare(password, user["password"], (err, result) => {
                        if (result && user) {
                            console.log("[USERCONTROLLER] Creating token");
                            const token = (0, jsonwebtoken_1.sign)({ id: user["id"] }, String(process.env.ACCESSTOKENSECRET), {
                                expiresIn: 60 //s 
                            });
                            // armazenar o hash do token no browser como um HttpOnly cookie
                            return res.cookie('token', token, { httpOnly: true }).json({ auth: true, accessToken: token, user: user }).status(200);
                        }
                        else
                            return res.json({ error: "invalid_credentials" });
                    });
                }
                else
                    badField();
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'logout'`);
            try {
                console.log("[USERCONTROLLER] Removing token from cookie");
                return res.cookie('token', null, { httpOnly: true }).json({ message: "User logouted" }).status(200);
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
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
                const user = new User_entity_1.User();
                if (!phone_number && !email) {
                    console.error('[USERCONTROLLER] Error: Missing email or phone number');
                    return res.status(400).json({
                        error: 'missing_email_or_number'
                    });
                }
                if (!phone_number) {
                    console.log('[USERCONTROLLER] Validating email');
                    // validating email
                    if (!UserValidator_1.default.emailValidator(email)) {
                        console.error('[USERCONTROLLER] Error: Invalid email');
                        return res.status(400).json({
                            error: 'invalid_email!'
                        });
                    }
                    const emailInUse = yield User_entity_1.User.findOne({ email });
                    if (emailInUse) {
                        console.error('[USERCONTROLLER] Error: Email already in use');
                        return res.status(400).json({
                            error: 'email_already_in_use'
                        });
                    }
                }
                if (!email) {
                    console.log('[USERCONTROLLER] Validating phone number');
                    // validating phone number
                    if (!UserValidator_1.default.phoneValidator(phone_number)) {
                        console.error('[USERCONTROLLER] Error: Invalid phone number');
                        return res.status(400).json({
                            error: 'invalid_phone_number'
                        });
                    }
                    const phoneInUse = yield User_entity_1.User.findOne({ phone_number });
                    if (phoneInUse) {
                        console.error('[USERCONTROLLER] Error: Phone number already in use');
                        return res.status(400).json({
                            error: 'phone_number_already_in_use'
                        });
                    }
                }
                console.log('[USERCONTROLLER] Validating username');
                // validating username
                if (!UserValidator_1.default.usernameValidator(username)) {
                    console.error('[USERCONTROLLER] Error: Invalid username');
                    return res.status(400).json({
                        error: 'invalid_username'
                    });
                }
                const usernameInUse = yield User_entity_1.User.findOne({ username });
                if (usernameInUse) {
                    console.error('[USERCONTROLLER] Error: Username already in use');
                    return res.status(400).json({
                        error: 'username_already_in_use'
                    });
                }
                console.log('[USERCONTROLLER] Validating full name');
                // validating name
                if (!UserValidator_1.default.nameValidator(full_name)) {
                    console.error('[USERCONTROLLER] Error: Invalid name');
                    return res.status(400).json({
                        error: 'invalid_name'
                    });
                }
                console.log('[USERCONTROLLER] Validating password');
                // validating password
                if (!UserValidator_1.default.passwordValidator(password)) {
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
                    console.log("[USERCONTROLLER] Creating token");
                    const token = (0, jsonwebtoken_1.sign)({ id: user["id"] }, String(process.env.ACCESSTOKENSECRET), {
                        expiresIn: 10 //s 
                    });
                    // armazenar o token no browser como um HttpOnly cookie
                    return res.cookie('token', token, { httpOnly: true }).json({ auth: true, accessToken: token }).status(200);
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
                if (!UserValidator_1.default.usernameValidator(username)) {
                    console.error("[USERCONTROLLER] Invalid username");
                    return res.status(400).send("invalid_username");
                }
                const users = yield User_entity_1.User.findOne({ username });
                console.log("[USERCONTROLLER] Database query successfull");
                return res.status(200).json({ users });
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    findByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findByEmail'`);
            try {
                const { email } = req.body = req.params;
                if (!UserValidator_1.default.emailValidator(email)) {
                    console.error("[USERCONTROLLER] Invalid email");
                    return res.status(400).send("invalid_email");
                }
                const users = yield User_entity_1.User.findOne({ email });
                console.log("[USERCONTROLLER] Database query successfull");
                return res.status(200).json({ users });
            }
            catch (error) {
                console.error("[USERCONTROLLER] Failed");
                res.status(400).send(error);
            }
        });
    }
    findByPhone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findByPhone'`);
            try {
                const { phone_number } = req.body = req.params;
                console.log(phone_number);
                if (!UserValidator_1.default.phoneValidator(phone_number)) {
                    console.error("[USERCONTROLLER] Invalid phone");
                    return res.status(400).send("invalid_phone");
                }
                const users = yield User_entity_1.User.findOne({ phone_number });
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
                const users = yield User_entity_1.User.find();
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
                let user = yield User_entity_1.User.findOne({ username });
                console.log("[USERCONTROLLER] Database query successfull");
                if (!user) {
                    console.error("[USERCONTROLLER] User doesn't exist");
                    return res.status(400).json({ error: "user_does_not_exist" });
                }
                // updating data on user object
                user[column] = newValue;
                yield User_entity_1.User.save(user);
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
                const user = yield User_entity_1.User.find({ username });
                console.log("[USERCONTROLLER] Database query successfull");
                if (!user) {
                    console.error("[USERCONTROLLER] User doesn't exist");
                    return res.status(400).json({ error: "user_does_not_exist" });
                }
                yield User_entity_1.User.remove(user);
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
