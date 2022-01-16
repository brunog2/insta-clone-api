import { User } from "../entities/User.entity";
import bcrypt from 'bcrypt';

interface IUser {
    id: number,
    full_name: string,
    email: string | null,
    phone_number: string | null,
    username: string,
    password: string
}

export default async function authUser(column: string, value: string, password: string) {
    console.log(`[AUTH] Attemping to auth user`);
    try {
        let user: IUser | undefined;

        const badField = () => {
            console.error("[AUTH] User not found");
            return { auth: false, error: "user_not_found" }
        }

        if (!password) {
            console.error("[AUTH] No password provided");
            return { auth: false, error: "password_required" }
        }

        column === "email" ? user = await User.findOne({ email: value }) :
            column === "phone_number" ? user = await User.findOne({ phone_number: value }) :
                column === "username" ? user = await User.findOne({ username: value }) :
                    badField();

        console.log("[AUTH] Database query successfull");

        console.log(user);

        if (user) {
            bcrypt.compare(password, user["password"], (err, result) => {
                if (result && user) {
                    return { auth: true, user_id: user["id"]}
                }
                else return { auth: false, error: "invalid_credentials" };
            })
        } else badField();
    } catch (error) {
        console.error("[AUTH] Failed");
        return {auth: false, error};
    }
}