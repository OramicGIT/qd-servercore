const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware для обработки JSON
app.use(express.json());

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Server is working');
});

// Модули
const loginModule = require('./login.js');
const lvlSpecModule = require('./getSpecial.js');
const lvlModule = require('./getGDlevel.js');
loginModule(app);
lvlSpecModule(app);
lvlModule(app);

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
