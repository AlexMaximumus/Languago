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

// ... (остальные функции без изменений до updateFlashcard)

function updateFlashcard() {
    const container = document.getElementById('flashcards-container');
    
    if (currentSection === 'test') {
        // Для тестового режима
        const question = currentWords[currentWordIndex];
        container.innerHTML = `
            <div class="card">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="kanji">${question.kanji}</div>
                        <div class="question">${question.question}</div>
                        <div class="options">
                            ${question.options.map((option, index) => `
                                <button class="option-button" onclick="checkAnswer(${index})">${option}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="explanation">${question.explanation}</div>
                    </div>
                </div>
            </div>
            <div class="controls">
                <button class="button" onclick="previousCard()">← Назад</button>
                <button class="button" onclick="nextCard()">Вперёд →</button>
            </div>
            <div class="progress">
                Вопрос ${currentWordIndex + 1} из ${currentWords.length}
            </div>
        `;
    } else {
        // Для режима изучения (оставляем как есть)
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
}

// ... (остальные функции без изменений)

// Добавляем новую функцию для проверки ответов
function checkAnswer(selectedIndex) {
    const question = currentWords[currentWordIndex];
    const selectedAnswer = question.options[selectedIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.disabled = true;
        if (button.textContent === question.correct) {
            button.classList.add('correct');
        } else if (button.textContent === selectedAnswer && !isCorrect) {
            button.classList.add('incorrect');
        }
    });

    // Показываем объяснение
    const card = document.querySelector('.card');
    card.classList.add('flipped');
}

document.addEventListener('DOMContentLoaded', function() {
    tg.ready();
    showMainMenu();
});
