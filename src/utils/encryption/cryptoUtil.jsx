import CryptoJS from "crypto-js";
import { Labels } from "../../utils/constants/labels";

const secretKey = "uG7@w#9zN!3rL5bE8xT$qF1mZpYcV6Kd";

/**
 * Encrypts a plain text password using AES.
 * @param {string} password - The plain password to encrypt.
 * @returns {string} - Encrypted password.
 */
export const encryptPassword = (value) => {
    if (!value) return "";
    return CryptoJS.AES.encrypt(value, secretKey).toString();
};

/**
 * Decrypts an AES encrypted password string.
 * @param {string} encryptedValue - The encrypted password string.
 * @returns {string} - Decrypted password.
 */
export const decryptPassword = (encryptedValue) => {
    if (!encryptedValue) return ""; 
    const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
