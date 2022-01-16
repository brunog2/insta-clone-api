"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
exports.default = randomString;
