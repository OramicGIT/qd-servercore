// Функции для работы с новостями игры
const newsContainer = document.getElementById('news-container');

// Получение новостей с сервера
function fetchNews() {
    fetch('https://magnificent-cendol-1dc672.netlify.app/news')
        .then(response => response.json())
        .then(data => {
            newsContainer.innerHTML = ''; // Очистить контейнер
            data.news.forEach(newsItem => {
                const newsElement = document.createElement('div');
                newsElement.classList.add('news-item');
                newsElement.innerHTML = `
                    <h3>${newsItem.title}</h3>
                    <p>${newsItem.content}</p>
                    <span>${newsItem.date}</span>
                `;
                newsContainer.appendChild(newsElement);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке новостей:', error);
        });
}

// Отправка новости
function postNews(title, content) {
    const payload = { title, content };
    fetch('https://magnificent-cendol-1dc672.netlify.app/news', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        alert('Новость успешно отправлена!');
        fetchNews(); // Обновление новостей после отправки
    })
    .catch(error => {
        console.error('Ошибка при отправке новости:', error);
    });
}

// Функции для работы с уровнями
const levelContainer = document.getElementById('level-container');

// Получение всех уровней
function fetchLevels() {
    fetch('https://magnificent-cendol-1dc672.netlify.app/levels')
        .then(response => response.json())
        .then(data => {
            levelContainer.innerHTML = ''; // Очистить контейнер
            data.levels.forEach(level => {
                const levelElement = document.createElement('div');
                levelElement.classList.add('level-item');
                levelElement.innerHTML = `
                    <h4>${level.name}</h4>
                    <p>Тип уровня: ${level.type}</p>
                    <span>Автор: ${level.author}</span>
                `;
                levelContainer.appendChild(levelElement);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке уровней:', error);
        });
}

// Загрузка уровня
function uploadLevel(levelData) {
    fetch('https://magnificent-cendol-1dc672.netlify.app/upload-level', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(levelData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Уровень успешно загружен!');
        fetchLevels(); // Обновление уровня после загрузки
    })
    .catch(error => {
        console.error('Ошибка при загрузке уровня:', error);
    });
}

// Функции для работы с пользователями (Netlify Identity)
const identityContainer = document.getElementById('identity-container');

// Авторизация пользователя через Netlify Identity
function loginUser(email, password) {
    netlifyIdentity.login({ email, password })
        .then(user => {
            console.log('Пользователь авторизован:', user);
            alert('Вы успешно вошли!');
            updateUserStatus(user);
        })
        .catch(error => {
            console.error('Ошибка при авторизации:', error);
        });
}

// Регистрация пользователя через Netlify Identity
function registerUser(email, password) {
    netlifyIdentity.signup({ email, password })
        .then(user => {
            console.log('Пользователь зарегистрирован:', user);
            alert('Вы успешно зарегистрировались!');
            updateUserStatus(user);
        })
        .catch(error => {
            console.error('Ошибка при регистрации:', error);
        });
}

// Выход из аккаунта
function logoutUser() {
    netlifyIdentity.logout()
        .then(() => {
            alert('Вы вышли из системы');
            updateUserStatus(null);
        })
        .catch(error => {
            console.error('Ошибка при выходе из системы:', error);
        });
}

// Обновление статуса пользователя
function updateUserStatus(user) {
    if (user) {
        identityContainer.innerHTML = `
            <p>Добро пожаловать, ${user.email}!</p>
            <button onclick="logoutUser()">Выйти</button>
        `;
    } else {
        identityContainer.innerHTML = `
            <button onclick="showLoginForm()">Войти</button>
            <button onclick="showRegisterForm()">Зарегистрироваться</button>
        `;
    }
}

// Формы для входа и регистрации
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}

function showRegisterForm() {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
}

// Управление гаунтлетами, маппаками и т.д.
const gauntletContainer = document.getElementById('gauntlet-container');

// Получение данных о гаунтлетах
function fetchGauntlets() {
    fetch('https://magnificent-cendol-1dc672.netlify.app/gauntlets')
        .then(response => response.json())
        .then(data => {
            gauntletContainer.innerHTML = ''; // Очистить контейнер
            data.gauntlets.forEach(gauntlet => {
                const gauntletElement = document.createElement('div');
                gauntletElement.classList.add('gauntlet-item');
                gauntletElement.innerHTML = `
                    <h4>${gauntlet.name}</h4>
                    <p>${gauntlet.description}</p>
                `;
                gauntletContainer.appendChild(gauntletElement);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке гаунтлетов:', error);
        });
}

// Загрузка нового гаунтлета
function uploadGauntlet(gauntletData) {
    fetch('https://magnificent-cendol-1dc672.netlify.app/upload-gauntlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gauntletData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Гаунтлет успешно загружен!');
        fetchGauntlets(); // Обновление гаунтлетов после загрузки
    })
    .catch(error => {
        console.error('Ошибка при загрузке гаунтлета:', error);
    });
}

// Инициализация страницы
window.onload = function() {
    fetchNews();
    fetchLevels();
    fetchGauntlets();
    updateUserStatus(netlifyIdentity.currentUser());
};
