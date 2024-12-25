const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Путь к папке базы данных уровней
const LEVELS_DIR = path.join(__dirname, 'backend/database/levels');

// Убедитесь, что папка существует
if (!fs.existsSync(LEVELS_DIR)) {
    fs.mkdirSync(LEVELS_DIR, { recursive: true });
}

// Конфигурация шифрования
const ENCRYPTION_KEY = crypto.randomBytes(32); // Используйте постоянный ключ в продакшене
const IV_LENGTH = 16;

// Middleware для обработки JSON
app.use(bodyParser.json());

// Функция для шифрования данных
const encryptData = (data) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

// Функция для дешифрования данных
const decryptData = (encrypted, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

// Добавить новый уровень
app.post('/add-level', (req, res) => {
    const { id, name, author, difficulty, description, downloadUrl } = req.body;

    if (!id || !name || !author || !difficulty || !description || !downloadUrl) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Проверяем, не существует ли уже файл с таким ID
    const levelFilePath = path.join(LEVELS_DIR, `${id}.level`);
    if (fs.existsSync(levelFilePath)) {
        return res.status(409).json({ message: 'Level with this ID already exists.' });
    }

    // Формируем данные уровня
    const levelData = JSON.stringify({ id, name, author, difficulty, description, downloadUrl });

    // Сжимаем и шифруем данные
    const compressed = zlib.deflateSync(levelData).toString('base64');
    const { iv, encryptedData } = encryptData(compressed);

    // Сохраняем в файл
    const levelPayload = JSON.stringify({ iv, data: encryptedData });
    fs.writeFileSync(levelFilePath, levelPayload);

    res.status(201).json({ message: 'Level added successfully.', id });
});

// Получить уровень по ID
app.get('/get-level', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Level ID is required.' });
    }

    const levelFilePath = path.join(LEVELS_DIR, `${id}.level`);
    if (!fs.existsSync(levelFilePath)) {
        return res.status(404).json({ message: 'Level not found.' });
    }

    // Читаем файл
    const levelPayload = JSON.parse(fs.readFileSync(levelFilePath));
    const { iv, data } = levelPayload;

    // Дешифруем и разжимаем данные
    const decrypted = decryptData(data, iv);
    const decompressed = zlib.inflateSync(Buffer.from(decrypted, 'base64')).toString();

    res.json(JSON.parse(decompressed));
});

// Получить список всех уровней
app.get('/list-levels', (req, res) => {
    const files = fs.readdirSync(LEVELS_DIR).filter(file => file.endsWith('.level'));

    if (files.length === 0) {
        return res.status(404).json({ message: 'No levels found.' });
    }

    const levels = files.map(file => {
        const id = path.basename(file, '.level');
        return { id };
    });

    res.json(levels);
});

// Удалить уровень
app.delete('/delete-level', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Level ID is required.' });
    }

    const levelFilePath = path.join(LEVELS_DIR, `${id}.level`);
    if (!fs.existsSync(levelFilePath)) {
        return res.status(404).json({ message: 'Level not found.' });
    }

    fs.unlinkSync(levelFilePath);
    res.json({ message: 'Level deleted successfully.' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
