const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Middleware для работы с JSON
app.use(bodyParser.json());

// Основной маршрут для регистрации и входа
app.post('/account', (req, res) => {
    const { username, password } = req.body;

    // Папка, где будут храниться файлы пользователей
    const USERS_DIR = path.join(__dirname, 'public/backend/database/users');

    // Проверяем входные данные
    if (!username || !password) {
        return res.status(400).json({ message: 'Укажите имя пользователя и пароль.' });
    }

    // Убедитесь, что папка существует
    if (!fs.existsSync(USERS_DIR)) {
        fs.mkdirSync(USERS_DIR, { recursive: true });
    }

    // Получаем список файлов пользователей
    const files = fs.readdirSync(USERS_DIR);

    // Проверяем, существует ли пользователь
    const existingFile = files.find((file) => {
        const filePath = path.join(USERS_DIR, file);
        const userData = JSON.parse(fs.readFileSync(filePath));
        return userData.name === username;
    });

    if (existingFile) {
        // Если пользователь найден, проверяем пароль
        const userData = JSON.parse(fs.readFileSync(path.join(USERS_DIR, existingFile)));
        if (userData.password === password) {
            return res.status(200).json({ message: `Добро пожаловать, ${username}!` });
        } else {
            return res.status(401).json({ message: 'Неверный пароль.' });
        }
    } else {
        // Если пользователь не найден, создаём нового
        const newUser = {
            perms: "",
            owngame: "false",
            canall: "false:debugno",
            developer: "0",
            name: username,
            clan: "",
            password: password,
            commentscol: "255,255,255",
            can_server: "false",
            orbs: "0",
            diamonds: "0",
            icons: "default pack",
            coins1: "0",
            coins2: "0",
            coins3: "0",
            versuspoints: "0",
            stars: "0",
        };

        // Определяем имя нового файла (следующий по порядку)
        const newFilename = path.join(USERS_DIR, `${files.length + 1}.json`);
        fs.writeFileSync(newFilename, JSON.stringify(newUser, null, 2));

        return res.status(201).json({ message: `Аккаунт зарегистрирован! Добро пожаловать, ${username}.` });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
