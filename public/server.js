const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware для обработки JSON
app.use(express.json());

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Server is working');
});

// Пример подключения модуля
// const exampleModule = require('/backend/test.js');
// exampleModule(app);

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});