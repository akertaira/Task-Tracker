import CryptoJS from 'crypto-js';

// Секретный ключ (в реальном приложении храните в .env)
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'my-super-secret-key-2024-task-tracker';

/**
 * Шифрование данных
 * @param {any} data - данные для шифрования
 * @returns {string} - зашифрованная строка
 */
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('❌ Ошибка шифрования:', error);
    return null;
  }
};

/**
 * Расшифровка данных
 * @param {string} encryptedData - зашифрованная строка
 * @returns {any} - расшифрованные данные
 */
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('❌ Ошибка расшифровки:', error);
    return null;
  }
};

/**
 * Шифрование строки
 * @param {string} text - текст для шифрования
 * @returns {string} - зашифрованная строка
 */
export const encryptText = (text) => {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('❌ Ошибка шифрования текста:', error);
    return null;
  }
};

/**
 * Расшифровка строки
 * @param {string} encryptedText - зашифрованный текст
 * @returns {string} - расшифрованный текст
 */
export const decryptText = (encryptedText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('❌ Ошибка расшифровки текста:', error);
    return null;
  }
};

/**
 * Хеширование пароля (необратимое)
 * @param {string} password - пароль
 * @returns {string} - хеш пароля
 */
export const hashPassword = (password) => {
  try {
    return CryptoJS.SHA256(password).toString();
  } catch (error) {
    console.error('❌ Ошибка хеширования:', error);
    return null;
  }
};

/**
 * Проверка пароля
 * @param {string} password - введенный пароль
 * @param {string} hash - сохраненный хеш
 * @returns {boolean}
 */
export const verifyPassword = (password, hash) => {
  try {
    return hashPassword(password) === hash;
  } catch (error) {
    console.error('❌ Ошибка проверки пароля:', error);
    return false;
  }
};