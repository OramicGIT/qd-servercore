const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Путь к папке для временных файлов
const TEMP_DIR = path.join(__dirname, 'temp');

// Убедиться, что папка temp существует
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Middleware для обработки JSON
app.use(bodyParser.json());

// Хранилище пользователей (читаем данные из файла при старте сервера)
const usersFilePath = path.join(TEMP_DIR, 'users.json');
let users = {};

// Если файл пользователей существует, загружаем данные
if (fs.existsSync(usersFilePath)) {
    try {
        users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    } catch (err) {
        console.error('Ошибка при чтении файла пользователей:', err);
    }
}

// Функция для сохранения пользователей в файл
function saveUsersToFile() {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Регистрация
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Имя пользователя и пароль обязательны.' });
    }

    if (users[username]) {
        return res.status(400).json({ error: 'Пользователь с таким именем уже существует.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = {
        password: hashedPassword,
        roles: [], // Роли пользователя
        email: null, // Дополнительные данные
    };

    saveUsersToFile();
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
});

// Вход
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Имя пользователя и пароль обязательны.' });
    }

    const user = users[username];
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Неверный пароль.' });
    }

    res.status(200).json({
        message: 'Вход выполнен успешно.',
        user: {
            username,
            roles: user.roles,
            email: user.email,
        },
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
