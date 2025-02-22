let tg = window.Telegram.WebApp;
tg.expand();

let currentCategory = null;
let currentWords = [];
let currentWordIndex = 0;
let wordsData = null;
let currentSection = 'main-menu';

async function loadWords(type) {
    try {
        console.log(`Загрузка файла для режима: ${type}`);
        let response;
        switch(type) {
            case 'words':
                response = await fetch('/Language/data/words.json');
                break;
            case 'kanji':
                response = await fetch('/Language/data/kanji.json');
                break;
            case 'emoji':
                response = await fetch('/Language/data/emoji.json');
                break;
            case 'test':
                response = await fetch('/Language/data/test.json');
                break;
            default:
                throw new Error('Неизвестный тип данных');
        }

        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Данные загружены успешно:`, data);
        wordsData = data;
        displayCategories();
    } catch (error) {
        console.error('Ошибка:', error);
        wordsData = {
            "default": {
                "title": "Категория",
                "words": []
            }
        };
        displayCategories();
    }
}

// ... (остальной код остается без изменений)
