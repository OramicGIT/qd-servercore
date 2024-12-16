// Функция для проверки состояния сервера
async function checkServerHealth() {
    try {
        const response = await fetch('/status'); // Эндпоинт для проверки состояния
        if (!response.ok) {
            console.error('Server health check failed:', response.statusText);
            applyFixes();
        } else {
            console.log('Server is running smoothly');
        }
    } catch (error) {
        console.error('Error during health check:', error.message);
        applyFixes();
    }
}

// Функция для применения исправлений
async function applyFixes() {
    console.log('Applying fixes...');
    try {
        // Перезагрузка кэша (пример)
        const cacheFix = await fetch('/fix-cache', { method: 'POST' });
        if (!cacheFix.ok) throw new Error('Cache fix failed');
        
        // Перезапуск служб (пример)
        const serviceRestart = await fetch('/restart-services', { method: 'POST' });
        if (!serviceRestart.ok) throw new Error('Service restart failed');
        
        console.log('Fixes applied successfully.');
    } catch (error) {
        console.error('Failed to apply fixes:', error.message);
    }
}

// Таймер для выполнения задач каждые 5-10 минут
setInterval(() => {
    console.log('Running periodic server checks...');
    checkServerHealth();
}, randomInterval(5, 10));

// Генерация случайного интервала (в минутах)
function randomInterval(min, max) {
    const minutes = Math.floor(Math.random() * (max - min + 1)) + min;
    return minutes * 60 * 1000; // Преобразование в миллисекунды
}