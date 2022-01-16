"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_libphonenumber_1 = __importDefault(require("google-libphonenumber"));
const jsonwebtoken_1 = require("jsonwebtoken");
class UserValidator {
    nameValidator(full_name) {
        if (full_name.replace(/\s/g, "").length > 5) {
            return true;
        }
        else
            return false;
    }
    emailValidator(email) {
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(mailformat)) {
            return true;
        }
        else
            return false;
    }
    phoneValidator(phone_number) {
        const phoneUtil = google_libphonenumber_1.default.PhoneNumberUtil.getInstance();
        try {
            if (phoneUtil.isValidNumber(phoneUtil.parse(phone_number))) {
                return true;
            }
            else
                return false;
        }
        catch (err) {
        }
    }
    usernameValidator(username) {
        if (username)
            return true;
        else
            return false;
    }
    passwordValidator(password) {
        if (password.length > 5)
            return true;
        else
            return false;
    }
    verifyToken(token) {
        let r;
        (0, jsonwebtoken_1.verify)(token, String(process.env.ACCESSTOKENSECRET), function (err, decoded) {
            if (err)
                return r = false;
            return r = true;
        });
        return r;
    }
}
exports.default = new UserValidator();
