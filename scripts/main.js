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
                response = await fetch('data/words.json');
                break;
            case 'kanji':
                response = await fetch('data/kanji.json');
                break;
            case 'emoji':
                response = await fetch('data/emoji.json');
                break;
            case 'test':
                response = await fetch('data/test.json');
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

function showMainMenu() {
    currentSection = 'main-menu';
    document.getElementById('main-menu').style.display = 'grid';
    document.getElementById('categories-container').style.display = 'none';
    document.getElementById('flashcards-container').style.display = 'none';
    document.querySelector('.back-button').style.display = 'none';
    document.querySelector('.header p').textContent = 'Выберите режим изучения';
}

function showSection(section) {
    currentSection = section;
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('categories-container').style.display = 'grid';
    document.querySelector('.back-button').style.display = 'block';
    
    switch(section) {
        case 'words':
            document.querySelector('.header p').textContent = 'Изучение слов';
            loadWords('words');
            break;
        case 'kanji':
            document.querySelector('.header p').textContent = 'Изучение кандзи';
            loadWords('kanji');
            break;
        case 'emoji':
            document.querySelector('.header p').textContent = 'Изучение эмодзи';
            loadWords('emoji');
            break;
        case 'test':
            document.querySelector('.header p').textContent = 'Тестирование';
            loadWords('test');
            break;
    }
}

function displayCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    
    for (const [key, category] of Object.entries(wordsData)) {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.onclick = () => selectCategory(key);
        
        categoryCard.innerHTML = `
            <div class="category-icon">${category.icon || '📚'}</div>
            <div class="category-title">${category.title}</div>
            <div class="category-count">${category.words.length} слов</div>
        `;
        
        container.appendChild(categoryCard);
    }
}

function selectCategory(category) {
    if (!wordsData) return;
    
    currentCategory = category;
    currentWords = wordsData[category].words;
    currentWordIndex = 0;

    document.getElementById('categories-container').style.display = 'none';
    document.getElementById('flashcards-container').style.display = 'block';
    document.querySelector('.back-button').style.display = 'block';
    document.querySelector('.header p').textContent = `Категория: ${wordsData[category].title}`;
    
    updateFlashcard();
}

function updateFlashcard() {
    const container = document.getElementById('flashcards-container');
    const symbol = currentWords[currentWordIndex].kanji || currentWords[currentWordIndex].emoji;
    
    container.innerHTML = `
        <div class="card" onclick="flipCard(this)">
            <div class="card-inner">
                <div class="card-front">
                    <div class="furigana">${currentWords[currentWordIndex].furigana}</div>
                    <div class="kanji">${symbol}</div>
                </div>
                <div class="card-back">
                    <div class="romaji">${currentWords[currentWordIndex].romaji}</div>
                    <div class="translation">${currentWords[currentWordIndex].translation}</div>
                </div>
            </div>
        </div>
        <div class="controls">
            <button class="button" onclick="previousCard()">← Назад</button>
            <button class="button" onclick="nextCard()">Вперёд →</button>
        </div>
        <div class="progress">
            Карточка ${currentWordIndex + 1} из ${currentWords.length}
        </div>
    `;
}

function showCategories() {
    if (currentSection === 'main-menu') return;
    
    if (document.getElementById('flashcards-container').style.display === 'block') {
        // Если открыты карточки, возвращаемся к категориям
        document.getElementById('categories-container').style.display = 'grid';
        document.getElementById('flashcards-container').style.display = 'none';
        document.querySelector('.header p').textContent = 'Выберите категорию для изучения';
    } else {
        // Если открыты категории, возвращаемся в главное меню
        showMainMenu();
    }
}

function flipCard(card) {
    card.classList.toggle('flipped');
}

function nextCard() {
    if (!currentWords.length) return;
    currentWordIndex = (currentWordIndex + 1) % currentWords.length;
    updateFlashcard();
}

function previousCard() {
    if (!currentWords.length) return;
    currentWordIndex = (currentWordIndex - 1 + currentWords.length) % currentWords.length;
    updateFlashcard();
}

document.addEventListener('DOMContentLoaded', function() {
    tg.ready();
    showMainMenu();
});
