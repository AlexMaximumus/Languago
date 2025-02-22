let tg = window.Telegram.WebApp;
tg.expand();

let currentCategory = null;
let currentWords = [];
let currentWordIndex = 0;
let wordsData = null;

// Загрузка слов из JSON файла
async function loadWords() {
    try {
        const response = await fetch('data/words.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки слов');
        }
        wordsData = await response.json();
        updateCategoryCounts();
    } catch (error) {
        console.error('Ошибка:', error);
        // Если не удалось загрузить JSON, используем встроенные данные
        wordsData = {
            "nature": {
                "title": "Природа",
                "words": []
            },
            "food": {
                "title": "Еда",
                "words": []
            },
            "communication": {
                "title": "Общение",
                "words": []
            }
        };
        updateCategoryCounts();
    }
}

function updateCategoryCounts() {
    for (const category in wordsData) {
        const count = wordsData[category].words.length;
        const countElement = document.querySelector(`[onclick="selectCategory('${category}')"] .category-count`);
        if (countElement) {
            countElement.textContent = `${count} слов`;
        }
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
    container.innerHTML = `
        <div class="card" onclick="flipCard(this)">
            <div class="card-inner">
                <div class="card-front">
                    <div class="furigana">${currentWords[currentWordIndex].furigana}</div>
                    <div class="kanji">${currentWords[currentWordIndex].kanji}</div>
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
    document.getElementById('categories-container').style.display = 'grid';
    document.getElementById('flashcards-container').style.display = 'none';
    document.querySelector('.back-button').style.display = 'none';
    document.querySelector('.header p').textContent = 'Выберите категорию для изучения';
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
    loadWords();
});
