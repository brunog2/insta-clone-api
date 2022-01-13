import express from 'express';
import bcrypt from 'bcrypt';
import { sign, decode } from 'jsonwebtoken';
import { User } from '../entity/User';
import UserValidator from '../util/validators/UserValidator';

type userColumn = {
    [key: string]: 'full_name' | 'email' | 'phone_number' | 'username' | 'password'
}

interface IUser {
    id: number,
    full_name: string,
    email: string | null,
    phone_number: string | null,
    username: string,
    password: string
}

class UserController {
    public async posts(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'posts'`);
        try {
            let { token } = req.cookies;

            console.log(`[USERCONTROLLER] User coookies`, req.cookies);

            if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

            else if (!UserValidator.verifyToken(token)) {
                return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
            }

            const decodedToken = decode(token) as { id: number };
            const id = decodedToken.id;

            console.log(`[USERCONTROLLER] User '${id}' authenticated`);

            const user = await User.findOne({id});
            console.log(user);

            // se tudo estiver ok gera um novo token e envia de volta pro usuário, salva no request para uso posterior
            console.log("[USERCONTROLLER] Creating new token");

            token = sign({ id: id }, String(process.env.ACCESSTOKENSECRET), { expiresIn: 60 });

            // armazenar o hash do token no browser como um HttpOnly cookie
            return res.cookie('token', token, { httpOnly: true }).json({ auth: true, accessToken: token, user }).status(200);
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async login(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'login'`);
        try {
            const { email, phone_number, username, password } = req.body;

            let user: IUser | undefined;

            const badField = () => {
                console.error("[USERCONTROLLER] User not found");
                return res.json({ error: "user_not_found" })
            }

            if (!password) {
                console.error("[USERCONTROLLER] No password provided");
                return res.json({ error: "password_required" })
            }

            email ? user = await User.findOne({ email }) :
                phone_number ? user = await User.findOne({ phone_number }) :
                    username ? user = await User.findOne({ username }) :
                        badField();

            console.log("[USERCONTROLLER] Database query successfull");

            console.log(user);

            if (user) {
                bcrypt.compare(password, user["password"], (err, result) => {
                    if (result && user) {
                        console.log("[USERCONTROLLER] Creating token");
                        const token = sign({ id: user["id"] }, String(process.env.ACCESSTOKENSECRET), {
                            expiresIn: 60 //s 
                        });

                        // armazenar o hash do token no browser como um HttpOnly cookie
                        return res.cookie('token', token, { httpOnly: true }).json({ auth: true, accessToken: token, user: user}).status(200);
                    }
                    else return res.json({ error: "invalid_credentials" });
                })
            } else badField();


        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async logout(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'logout'`);
        try {
            console.log("[USERCONTROLLER] Removing token from cookie");            
            return res.cookie('token', null, { httpOnly: true }).json({ message: "User logouted" }).status(200);
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async store(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'store'`);
        try {
            var { full_name, email, phone_number, username, password } = req.body;

            // missing filled fields
            if (!(full_name || email || phone_number || username || password)) {
                console.error('[USERCONTROLLER] Error: All fields are required');
                return res.status(400).json({
                    error: 'all_fields_required'
                })
            }

            const user = new User();

            if (!phone_number && !email) {
                console.error('[USERCONTROLLER] Error: Missing email or phone number');
                return res.status(400).json({
                    error: 'missing_email_or_number'
                })
            }

            if (!phone_number) {
                console.log('[USERCONTROLLER] Validating email');
                // validating email
                if (!UserValidator.emailValidator(email)) {
                    console.error('[USERCONTROLLER] Error: Invalid email');
                    return res.status(400).json({
                        error: 'invalid_email!'
                    })
                }
                const emailInUse = await User.findOne({ email });
                if (emailInUse) {
                    console.error('[USERCONTROLLER] Error: Email already in use');
                    return res.status(400).json({
                        error: 'email_already_in_use'
                    })
                }
            }

            if (!email) {
                console.log('[USERCONTROLLER] Validating phone number');
                // validating phone number
                if (!UserValidator.phoneValidator(phone_number)) {
                    console.error('[USERCONTROLLER] Error: Invalid phone number');
                    return res.status(400).json({
                        error: 'invalid_phone_number'
                    })
                }
                const phoneInUse = await User.findOne({ phone_number });
                if (phoneInUse) {
                    console.error('[USERCONTROLLER] Error: Phone number already in use');
                    return res.status(400).json({
                        error: 'phone_number_already_in_use'
                    })
                }
            }
            console.log('[USERCONTROLLER] Validating username');
            // validating username
            if (!UserValidator.usernameValidator(username)) {
                console.error('[USERCONTROLLER] Error: Invalid username');
                return res.status(400).json({
                    error: 'invalid_username'
                })
            }

            const usernameInUse = await User.findOne({ username });
            if (usernameInUse) {
                console.error('[USERCONTROLLER] Error: Username already in use');
                return res.status(400).json({
                    error: 'username_already_in_use'
                })
            }

            console.log('[USERCONTROLLER] Validating full name');
            // validating name
            if (!UserValidator.nameValidator(full_name)) {
                console.error('[USERCONTROLLER] Error: Invalid name');
                return res.status(400).json({
                    error: 'invalid_name'
                })
            }

            console.log('[USERCONTROLLER] Validating password');
            // validating password
            if (!UserValidator.passwordValidator(password)) {
                console.error('[USERCONTROLLER] Error: Invalid password');
                return res.status(400).json({
                    error: 'invalid_password'
                })
            }

            console.log('[USERCONTROLLER] All fields are valid');

            console.log('[USERCONTROLLER] Hashing password');
            bcrypt.hash(password, 10, async (err, hash) => {
                password = hash;
                console.log(`[USERCONTROLLER] Password hashed`);
                user.full_name = full_name;
                user.email = email;
                user.phone_number = phone_number;
                user.username = username;
                user.password = password;
                await user.save();
                console.log("[USERCONTROLLER] Database query successfull");

                console.log("[USERCONTROLLER] Creating token");
                const token = sign({ id: user["id"] }, String(process.env.ACCESSTOKENSECRET), {
                    expiresIn: 10 //s 
                });

                // armazenar o token no browser como um HttpOnly cookie
                return res.cookie('token', token, { httpOnly: true }).json({ auth: true, accessToken: token }).status(200);
            });
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async findByUsername(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findByUsername'`);
        try {
            const { username } = req.body = req.params;

            if (!UserValidator.usernameValidator(username)) {
                console.error("[USERCONTROLLER] Invalid username");
                return res.status(400).send("invalid_username");
            }

            const users = await User.findOne({ username });
            console.log("[USERCONTROLLER] Database query successfull");

            return res.status(200).json({ users });
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async findByEmail(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findByEmail'`);
        try {
            const { email } = req.body = req.params;

            if (!UserValidator.emailValidator(email)) {
                console.error("[USERCONTROLLER] Invalid email");
                return res.status(400).send("invalid_email");
            }

            const users = await User.findOne({ email });
            console.log("[USERCONTROLLER] Database query successfull");

            return res.status(200).json({ users });
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async findByPhone(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findByPhone'`);
        try {
            const { phone_number } = req.body = req.params;
            console.log(phone_number);

            if (!UserValidator.phoneValidator(phone_number)) {
                console.error("[USERCONTROLLER] Invalid phone");
                return res.status(400).send("invalid_phone");
            }

            const users = await User.findOne({ phone_number });
            console.log("[USERCONTROLLER] Database query successfull");

            return res.status(200).json({ users });
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async findAll(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findAll'`);
        try {
            const users = await User.find();
            console.log("[USERCONTROLLER] Database query successfull");

            return res.status(200).json({ users });
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async update(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'update'`);
        try {
            const { username, newValue } = req.body;

            const { column }: userColumn = req.body;

            let user = await User.findOne({ username });
            console.log("[USERCONTROLLER] Database query successfull");

            if (!user) {
                console.error("[USERCONTROLLER] User doesn't exist");
                return res.status(400).json({ error: "user_does_not_exist" });
            }

            // updating data on user object
            user[column] = newValue;

            await User.save(user);
            console.log("[USERCONTROLLER] Database query successfull");

            return res.status(200).json({ user });
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async delete(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'delete'`);
        try {
            const { username } = req.body;

            const user = await User.find({ username });
            console.log("[USERCONTROLLER] Database query successfull");

            if (!user) {
                console.error("[USERCONTROLLER] User doesn't exist");
                return res.status(400).json({ error: "user_does_not_exist" });
            }

            await User.remove(user);
            console.log("[USERCONTROLLER] Database query successfull");

            return res.status(200);
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }
}

export default UserController;