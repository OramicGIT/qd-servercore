const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const app = express();
const PORT = 3000;

// Папка для хранения уровней
const LEVELS_DIR = path.join(__dirname, 'backend/database/levels');

// Middleware
app.use(bodyParser.json());

// Убедимся, что папка уровней существует
if (!fs.existsSync(LEVELS_DIR)) {
    fs.mkdirSync(LEVELS_DIR, { recursive: true });
}

// ======================= Маршруты =======================

// Получить список всех уровней
app.get('/list-levels', (req, res) => {
    try {
        const files = fs.readdirSync(LEVELS_DIR);
        const levels = files.map(file => {
            const filePath = path.join(LEVELS_DIR, file);
            const compressedData = fs.readFileSync(filePath);
            const decompressedData = zlib.unzipSync(compressedData).toString('utf-8');
            const level = JSON.parse(decompressedData);
            return { id: level.id, name: level.name, author: level.author };
        });
        res.json(levels);
    } catch (err) {
        console.error('Ошибка получения списка уровней:', err);
        res.status(500).json({ message: 'Ошибка сервера при получении списка уровней.' });
    }
});

// Получить уровень по ID
app.get('/get-level', (req, res) => {
    const levelID = req.query.id;

    if (!levelID) {
        return res.status(400).json({ message: 'Укажите ID уровня.' });
    }

    try {
        const filePath = path.join(LEVELS_DIR, `${levelID}.json.gz`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Уровень не найден.' });
        }

        const compressedData = fs.readFileSync(filePath);
        const decompressedData = zlib.unzipSync(compressedData).toString('utf-8');
        res.json(JSON.parse(decompressedData));
    } catch (err) {
        console.error('Ошибка получения уровня:', err);
        res.status(500).json({ message: 'Ошибка сервера при получении уровня.' });
    }
});

// Добавить новый уровень
app.post('/add-level', (req, res) => {
    const { id, name, author, difficulty, description, downloadUrl } = req.body;

    if (!id || !name || !author) {
        return res.status(400).json({ message: 'Обязательные поля: id, name, author.' });
    }

    try {
        const newLevel = {
            id,
            name,
            author,
            difficulty: difficulty || 'Unknown',
            description: description || '',
            downloadUrl: downloadUrl || '',
            createdAt: new Date().toISOString()
        };

        const filePath = path.join(LEVELS_DIR, `${id}.json.gz`);

        if (fs.existsSync(filePath)) {
            return res.status(409).json({ message: 'Уровень с таким ID уже существует.' });
        }

        const compressedData = zlib.gzipSync(JSON.stringify(newLevel));
        fs.writeFileSync(filePath, compressedData);

        res.status(201).json({ message: `Уровень ${name} добавлен!` });
    } catch (err) {
        console.error('Ошибка добавления уровня:', err);
        res.status(500).json({ message: 'Ошибка сервера при добавлении уровня.' });
    }
});

// Удалить уровень
app.delete('/delete-level', (req, res) => {
    const levelID = req.query.id;

    if (!levelID) {
        return res.status(400).json({ message: 'Укажите ID уровня.' });
    }

    try {
        const filePath = path.join(LEVELS_DIR, `${levelID}.json.gz`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Уровень не найден.' });
        }

        fs.unlinkSync(filePath);
        res.json({ message: `Уровень ${levelID} успешно удален.` });
    } catch (err) {
        console.error('Ошибка удаления уровня:', err);
        res.status(500).json({ message: 'Ошибка сервера при удалении уровня.' });
    }
});

// ======================= Запуск сервера =======================
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
