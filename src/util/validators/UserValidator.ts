import libphonenumber from 'google-libphonenumber';
import { verify, VerifyErrors, JwtPayload } from 'jsonwebtoken';

class UserValidator {

    public nameValidator(full_name: string) {
        if (full_name.replace(/\s/g, "").length > 5) {
            return true;
        } else return false;
    }

    public emailValidator(email: string) {
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(mailformat)) {
            return true;
        } else return false;
    }

    public phoneValidator(phone_number: string) {
        const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        try {
            if (phoneUtil.isValidNumber(phoneUtil.parse(phone_number))) {
                return true;
            } else return false;
        } catch (err) {
        }
    }

    public usernameValidator(username: string) {
        if (username) return true;
        else return false;
    }

    public passwordValidator(password: string) {
        if (password.length > 5) return true;
        else return false;
    }

    public verifyToken(token: string) {
        let r;
        verify(token, String(process.env.ACCESSTOKENSECRET), function (err: VerifyErrors | null, decoded: JwtPayload | undefined) {
            if (err) return r = false;
            return r = true;
        });
        return r;
    }
}

export default new UserValidator();