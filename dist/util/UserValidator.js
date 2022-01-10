"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserValidator {
    constructor() {
        this.nameValidator;
    }
    nameValidator(full_name) {
        if (full_name.length > 5) {
            return true;
        }
        else
            return false;
    }
    emailValidator(email) {
    }
    phoneValidator(phone_number) {
    }
    usernameValidator(username) {
    }
    passwordValidator(password) {
    }
}
exports.default = UserValidator;
