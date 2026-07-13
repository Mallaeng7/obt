"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;
function getKey(salt) {
    return crypto_1.default.pbkdf2Sync(env_1.env.ENCRYPTION_KEY, salt, 100000, 32, 'sha512');
}
function encrypt(text) {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const salt = crypto_1.default.randomBytes(SALT_LENGTH);
    const key = getKey(salt);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}
function decrypt(cipherText) {
    const buffer = Buffer.from(cipherText, 'base64');
    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, TAG_POSITION);
    const tag = buffer.subarray(TAG_POSITION, ENCRYPTED_POSITION);
    const encrypted = buffer.subarray(ENCRYPTED_POSITION);
    const key = getKey(salt);
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted) + decipher.final('utf8');
}
