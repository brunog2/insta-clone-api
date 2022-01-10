"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_libphonenumber_1 = __importDefault(require("google-libphonenumber"));
class UserValidator {
    constructor() {
        this.nameValidator;
        this.emailValidator;
        this.phoneValidator;
        this.usernameValidator;
        this.passwordValidator;
    }
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
        if (phoneUtil.isValidNumber(phoneUtil.parse(phone_number))) {
            return true;
        }
        else
            return false;
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
}
exports.default = UserValidator;
