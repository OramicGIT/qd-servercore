const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Путь к папке users
const USERS_DIR = path.join(__dirname, 'public/backend/database/users');

// Middleware
app.use(bodyParser.json());

// Функция для получения уникального имени файла
function getUniqueFilename() {
    let i = 1;
    while (fs.existsSync(path.join(USERS_DIR, `${i}.json`))) {
        i++;
    }
    return `${i}.json`;
}

// Регистрация
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Укажите имя пользователя и пароль.' });
    }

    const filename = getUniqueFilename();
    const filePath = path.join(USERS_DIR, filename);

    const userData = {
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

    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
    res.status(201).json({ message: `Аккаунт зарегистрирован.` });
});

// Вход
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const files = fs.readdirSync(USERS_DIR);
    const userFile = files.find(file => {
        const userData = JSON.parse(fs.readFileSync(path.join(USERS_DIR, file)));
        return userData.name === username && userData.password === password;
    });

    if (userFile) {
        res.status(200).json({ message: `Добро пожаловать, ${username}!` });
    } else {
        res.status(401).json({ message: 'Неверное имя пользователя или пароль.' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер работает на http://localhost:${PORT}`);
});
