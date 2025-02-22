 let tg = window.Telegram.WebApp;
        tg.expand();

        let categories = null;
        let currentCategory = null;
        let currentCardIndex = 0;
        let currentSection = 'main';
        let emojiCategories = null;
        let currentEmojiCategory = null;
        let currentEmojiCardIndex = 0;
        let testQuestions = null;
        let currentQuestionIndex = 0;
        let correctAnswers = 0;

        function hideSplashScreen() {
            const splashScreen = document.getElementById('splash-screen');
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }

        function showMainMenu() {
            document.querySelector('.back-button').style.display = 'none';
            document.querySelector('.header p').textContent = 'Выберите режим изучения';
            document.getElementById('main-menu').style.display = 'grid';
            document.getElementById('words-section').style.display = 'none';
            document.getElementById('kanji-section').style.display = 'none';
            document.getElementById('test-section').style.display = 'none';
            document.getElementById('emoji-section').style.display = 'none';
            
            if (currentSection === 'words') {
                document.getElementById('categories-container').style.display = 'grid';
                document.getElementById('flashcards-container').style.display = 'none';
            } else if (currentSection === 'emoji') {
                document.getElementById('emoji-categories-container').style.display = 'grid';
                document.getElementById('emoji-flashcards-container').style.display = 'none';
            } else if (currentSection === 'test') {
                document.getElementById('test-start').style.display = 'block';
                document.getElementById('test-questions').style.display = 'none';
                document.getElementById('test-results').style.display = 'none';
            }
            
            currentSection = 'main';
        }

        function showSection(section) {
            document.querySelector('.back-button').style.display = 'block';
            document.getElementById('main-menu').style.display = 'none';
            
            document.getElementById('words-section').style.display = 'none';
            document.getElementById('kanji-section').style.display = 'none';
            document.getElementById('test-section').style.display = 'none';
            document.getElementById('emoji-section').style.display = 'none';
            
            let title = '';
            switch(section) {
                case 'words': 
                    title = 'Изучение слов';
                    loadCategories();
                    document.getElementById('words-section').style.display = 'block';
                    document.getElementById('categories-container').style.display = 'grid';
                    break;
                case 'kanji': 
                    title = 'Изучение кандзи';
                    document.getElementById('kanji-section').style.display = 'block';
                    break;
                case 'test': 
                    title = 'Тестирование';
                    document.getElementById('test-section').style.display = 'block';
                    loadTest();
                    break;
                case 'emoji':
                    title = 'Изучение смайликов';
                    loadEmojiCategories();
                    document.getElementById('emoji-section').style.display = 'block';
                    document.getElementById('emoji-categories-container').style.display = 'grid';
                    break;
            }
            document.querySelector('.header p').textContent = title;
            
            currentSection = section;
        }

        async function loadCategories() {
            try {
                const response = await fetch('/Languago/words.json');
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                const data = await response.json();
                categories = data;
                displayCategories();
            } catch (error) {
                console.error('Ошибка:', error);
                document.getElementById('categories-container').innerHTML = `
                    <div style="text-align: center; color: var(--tg-theme-hint-color);">
                        <p>Ошибка загрузки данных</p>
                        <button onclick="loadCategories()" class="nav-button">Попробовать снова</button>
                    </div>
                `;
            }
        }

        function displayCategories() {
            const container = document.getElementById('categories-container');
            container.innerHTML = '';
            container.style.display = 'grid';

            for (const [id, category] of Object.entries(categories)) {
                const categoryCard = document.createElement('div');
                categoryCard.className = 'category-card';
                categoryCard.onclick = () => showCategory(id);
                categoryCard.innerHTML = `
                    <div class="category-icon">${category.icon}</div>
                    <div class="category-title">${category.title}</div>
                    <div class="category-count">${category.words.length} слов</div>
                `;
                container.appendChild(categoryCard);
            }
        }

        function showCategory(categoryId) {
            currentCategory = categoryId;
            currentCardIndex = 0;
            
            document.getElementById('categories-container').style.display = 'none';
            document.getElementById('flashcards-container').style.display = 'block';
            document.querySelector('.header p').textContent = `${categories[categoryId].title}`;
            
            updateCard();
        }

        function updateCard() {
            const category = categories[currentCategory];
            const card = category.words[currentCardIndex];
            
            const container = document.getElementById('flashcards-container');
            container.innerHTML = `
                <div class="flashcard" onclick="flipCard(this)">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <div class="kanji">${card.kanji}</div>
                            <div class="furigana">${card.furigana}</div>
                        </div>
                        <div class="flashcard-back">
                            <div class="meaning">${card.translation}</div>
                            <div class="romaji">${card.romaji}</div>
                        </div>
                    </div>
                </div>
                <div class="navigation">
                    <button class="nav-button" onclick="previousCard()">← Назад</button>
                    <button class="nav-button" onclick="nextCard()">Вперёд →</button>
                </div>
                <div class="progress">
                    Карточка ${currentCardIndex + 1} из ${category.words.length}
                </div>
            `;
        }

        function flipCard(card) {
            card.classList.toggle('flipped');
        }

        function nextCard() {
            const category = categories[currentCategory];
            currentCardIndex = (currentCardIndex + 1) % category.words.length;
            updateCard();
        }

        function previousCard() {
            const category = categories[currentCategory];
            currentCardIndex = (currentCardIndex - 1 + category.words.length) % category.words.length;
            updateCard();
        }

        async function loadEmojiCategories() {
            try {
                const response = await fetch('/Languago/emoji.json');
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                const data = await response.json();
                emojiCategories = data;
                displayEmojiCategories();
            } catch (error) {
                console.error('Ошибка:', error);
                document.getElementById('emoji-categories-container').innerHTML = `
                    <div style="text-align: center; color: var(--tg-theme-hint-color);">
                        <p>Ошибка загрузки данных</p>
                        <button onclick="loadEmojiCategories()" class="nav-button">Попробовать снова</button>
                    </div>
                `;
            }
        }

        function displayEmojiCategories() {
            if (!emojiCategories) return;
            
            const container = document.getElementById('emoji-categories-container');
            container.innerHTML = '';
            container.style.display = 'grid';

            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.onclick = () => showEmojiCategory('emojis');
            categoryCard.innerHTML = `
                <div class="category-icon">${emojiCategories.emojis.icon}</div>
                <div class="category-title">${emojiCategories.emojis.title}</div>
                <div class="category-count">${emojiCategories.emojis.words.length} эмодзи</div>
            `;
            container.appendChild(categoryCard);
        }

        function showEmojiCategory(categoryId) {
            currentEmojiCategory = categoryId;
            currentEmojiCardIndex = 0;
            
            document.getElementById('emoji-categories-container').style.display = 'none';
            document.getElementById('emoji-flashcards-container').style.display = 'block';
            document.querySelector('.header p').textContent = `${emojiCategories[categoryId].title}`;
            
            updateEmojiCard();
        }

        function updateEmojiCard() {
            const category = emojiCategories.emojis;
            const card = category.words[currentEmojiCardIndex];
            
            const container = document.getElementById('emoji-flashcards-container');
            container.innerHTML = `
                <div class="flashcard" onclick="flipCard(this)">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <div class="kanji" style="font-size: 96px;">${card.emoji}</div>
                            <div class="furigana">${card.furigana}</div>
                        </div>
                        <div class="flashcard-back">
                            <div class="meaning">${card.translation}</div>
                            <div class="romaji">${card.romaji}</div>
                        </div>
                    </div>
                </div>
                <div class="navigation">
                    <button class="nav-button" onclick="previousEmojiCard()">← Назад</button>
                    <button class="nav-button" onclick="nextEmojiCard()">Вперёд →</button>
                </div>
                <div class="progress">
                    Карточка ${currentEmojiCardIndex + 1} из ${category.words.length}
                </div>
            `;
        }

        function nextEmojiCard() {
            const category = emojiCategories.emojis;
            currentEmojiCardIndex = (currentEmojiCardIndex + 1) % category.words.length;
            updateEmojiCard();
        }

        function previousEmojiCard() {
            const category = emojiCategories.emojis;
            currentEmojiCardIndex = (currentEmojiCardIndex - 1 + category.words.length) % category.words.length;
            updateEmojiCard();
        }

        async function loadTest() {
            try {
                const response = await fetch('/Languago/test.json');
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                const data = await response.json();
                testQuestions = data.basic.questions;
            } catch (error) {
                console.error('Ошибка:', error);
                document.getElementById('test-start').innerHTML = `
                    <div style="text-align: center; color: var(--tg-theme-hint-color);">
                        <p>Ошибка загрузки теста</p>
                        <button onclick="loadTest()" class="nav-button">Попробовать снова</button>
                    </div>
                `;
            }
        }

        function startTest() {
            currentQuestionIndex = 0;
            correctAnswers = 0;
            document.getElementById('test-start').style.display = 'none';
            document.getElementById('test-questions').style.display = 'block';
            showQuestion();
        }

        function showQuestion() {
            const question = testQuestions[currentQuestionIndex];
            const container = document.getElementById('test-questions');
            
            container.querySelector('.kanji').textContent = question.question;
            container.querySelector('.furigana').textContent = question.furigana;
            
            const optionsContainer = container.querySelector('.options-container');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = option;
                button.onclick = () => checkAnswer(index);
                optionsContainer.appendChild(button);
            });

            container.querySelector('.test-progress').textContent = 
                `Вопрос ${currentQuestionIndex + 1} из ${testQuestions.length}`;
        }

        function checkAnswer(selectedIndex) {
            const question = testQuestions[currentQuestionIndex];
            const buttons = document.querySelectorAll('.option-button');
            
            buttons.forEach(button => button.disabled = true);
            
            if (selectedIndex === question.correct) {
                buttons[selectedIndex].classList.add('correct');
                correctAnswers++;
            } else {
                buttons[selectedIndex].classList.add('wrong');
                buttons[question.correct].classList.add('correct');
            }

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < testQuestions.length) {
                    showQuestion();
                } else {
                    showResults();
                }
            }, 1500);
        }

        function showResults() {
            document.getElementById('test-questions').style.display = 'none';
            document.getElementById('test-results').style.display = 'block';
            
            const percentage = (correctAnswers / testQuestions.length) * 100;
            let message = '';
            let icon = '';
            
            if (percentage === 100) {
                message = 'Отлично! Все ответы правильные!';
                icon = '🎉';
            } else if (percentage >= 80) {
                message = 'Очень хороший результат!';
                icon = '🌟';
            } else if (percentage >= 60) {
                message = 'Неплохо, но есть куда расти!';
                icon = '👍';
            } else {
                message = 'Стоит повторить материал';
                icon = '📚';
            }

            document.querySelector('.results-icon').textContent = icon;
            document.querySelector('.score-container').innerHTML = `
                <p>${message}</p>
                <p>Правильных ответов: ${correctAnswers} из ${testQuestions.length}</p>
                <p>Процент успеха: ${percentage}%</p>
            `;
        }

        function restartTest() {
            document.getElementById('test-results').style.display = 'none';
            startTest();
        }

        document.addEventListener('DOMContentLoaded', function() {
            tg.ready();
            showMainMenu();
            setTimeout(() => {
                hideSplashScreen();
            }, 2000);
        });
