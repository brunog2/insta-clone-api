import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import UserValidator from '../util/validators/UserValidator';

type userColumn = {
    [key: string]: 'full_name' | 'email' | 'phone_number' | 'username' | 'password'
}

class UserController {
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

            const userValidator = new UserValidator();
            const user = new User();

            console.log('[USERCONTROLLER] Validating full name');
            // validating name
            if (!userValidator.nameValidator(full_name)) {
                console.error('[USERCONTROLLER] Error: Invalid name');
                return res.status(400).json({
                    error: 'invalid_name'
                })
            }

            console.log('[USERCONTROLLER] Validating email');
            // validating email
            if (!userValidator.emailValidator(email)) {
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

            console.log('[USERCONTROLLER] Validating phone number');
            // validating phone number
            if (!userValidator.phoneValidator(phone_number)) {
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

            console.log('[USERCONTROLLER] Validating username');
            // validating username
            if (!userValidator.usernameValidator(username)) {
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

            console.log('[USERCONTROLLER] Validating password');
            // validating password
            if (!userValidator.passwordValidator(username)) {
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
                return res.status(200).json({ user });
            });            
        } catch (error) {
            console.error("[USERCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async findByUsername(req: express.Request, res: express.Response) {
        console.log(`[USERCONTROLLER] Attemping to ${req.method} 'findByUsername'`);
        try {
            const { username }= req.body = req.params;

            const users = await User.findOne({ username });
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