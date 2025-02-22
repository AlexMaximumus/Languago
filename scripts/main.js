let testQuestions = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;

async function loadTest() {
    try {
        const response = await fetch('data/test.json');
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        const data = await response.json();
        testQuestions = data.basic.questions;
        startTest();
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
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });

    container.querySelector('.test-progress').textContent = 
        `Вопрос ${currentQuestionIndex + 1} из ${testQuestions.length}`;
}

function checkAnswer(selectedIndex, button) {
    const question = testQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-button');
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === question.correct) {
        button.classList.add('correct');
        correctAnswers++;
    } else {
        button.classList.add('wrong');
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
