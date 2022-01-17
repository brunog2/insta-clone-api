import { sign, decode } from 'jsonwebtoken';
import UserValidator from '../util/validators/UserValidator';

export default function authToken(token: string) {
    console.log(`[AUTH] Attemping to auth user`);

    try {

        if (!token) return { auth: false, message: 'No token provided.', token: undefined };

        else if (!UserValidator.verifyToken(token)) {
            return ({ auth: false, message: 'Failed to authenticate token.', token: undefined });
        }


        console.log(`[AUTH] User authenticated`);

        // se tudo estiver ok gera um novo token e envia de volta pro usuário, salva no request para uso posterior
        console.log("[AUTH] Creating new token");

        const decodedToken = decode(token) as { id: string };
        const id = decodedToken.id;

        token = sign({ id: id }, String(process.env.ACCESSTOKENSECRET), { expiresIn: 60 });

        return ({ auth: true, message: "User authenticated", token: token });

    } catch (error) {
        console.error("[USERCONTROLLER] Failed");
        console.error(error);
        return ({ auth: false, message: "Error", token: undefined });

    }

}