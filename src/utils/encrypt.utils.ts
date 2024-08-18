import EnvConfig from '../config/envConfig';
import CryptoJS from 'crypto-js';

// Saltkey should be managed securely, e.g., using environment variables
const Saltkey = EnvConfig.ENCRYPTION_KEY || 'your-default-saltkey-here';

// Function to encrypt data
export function encryptData(rawData: object): string {
    try {
        // Convert the object to a JSON string and encrypt it
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(rawData), Saltkey).toString();
        return encrypted;
    } catch (error:any) {
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

// Function to decrypt data
export function decryptData(encryptedValue: string): string {
    try {
        // Decrypt the encrypted value and convert it to a UTF-8 string
        const bytes = CryptoJS.AES.decrypt(encryptedValue, Saltkey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedString) {
            throw new Error('Decryption failed. Possibly due to an incorrect key or corrupted data.');
        }
        return decryptedString;
    } catch (error:any) {
        throw new Error(`Decryption failed: ${error.message}`);
    }
}
