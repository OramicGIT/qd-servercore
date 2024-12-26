const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// URL для загрузки запрещенных слов
const forbiddenWordsURL = 'https://www.freewebheaders.com/full-list-of-bad-words-banned-by-google/';

// Функция для загрузки запрещенных слов из интернета
async function fetchForbiddenWords() {
    const response = await fetch(forbiddenWordsURL);
    const text = await response.text();
    const words = text.split(/\r?\n/); // Разделяем слова по строкам
    return words;
}

// Функция для проверки текста на наличие запрещенных слов
function containsForbiddenWords(text, forbiddenWords) {
    const lowerCaseText = text.toLowerCase();
    return forbiddenWords.some(word => lowerCaseText.includes(word.toLowerCase()));
}

// Функция для удаления уровня
function deleteLevel(levelPath) {
    if (fs.existsSync(levelPath)) {
        fs.unlinkSync(levelPath);
        console.log(`Уровень ${levelPath} был удален.`);
    }
}

// Функция для блокировки аудио файла
function blockAudio(audioPath) {
    if (fs.existsSync(audioPath)) {
        fs.renameSync(audioPath, `${audioPath}.blocked`);
        console.log(`Аудио файл ${audioPath} был заблокирован.`);
    }
}

// Функция для проверки уровня
async function checkLevel(levelId) {
    const forbiddenWords = await fetchForbiddenWords();
    const levelPath = path.join(__dirname, 'backend/database/levels', `${levelId}.json.gz`);
    const levelData = fs.readFileSync(levelPath, 'utf-8');

    if (containsForbiddenWords(levelData, forbiddenWords)) {
        deleteLevel(levelPath);
    } else {
        console.log(`Level "${levelId}" прошел проверку.`);
    }
}

// Функция для проверки музыки и звуков
async function checkAudio(audioFilePath) {
    const forbiddenWords = await fetchForbiddenWords();
    const audioContent = fs.readFileSync(audioFilePath, 'utf-8');

    if (containsForbiddenWords(audioContent, forbiddenWords)) {
        blockAudio(audioFilePath);
    } else {
        console.log(`Audio "${path.basename(audioFilePath)}" прошел проверку.`);
    }
}
