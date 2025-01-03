let currentCategory = 'technology';
let currentWord = '';
let scrambledWord = '';
let score = 0;
let level = 1;
let streak = 0;
let timeLeft = 60;
let timer;
let hintsRemaining = 3;
let gameActive = false;

document.querySelectorAll('.category-option').forEach(card => {
    card.addEventListener('click', (e) => {
        currentCategory = card.dataset.category;
        document.getElementById('category-section').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
    });
});

function scrambleWord(word) {
    let array = word.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function newGame() {
    const currentWords = wordCategories[currentCategory];
    const randomIndex = Math.floor(Math.random() * currentWords.length);
    currentWord = currentWords[randomIndex].word;
    scrambledWord = scrambleWord(currentWord);
    while (scrambledWord === currentWord) {
        scrambledWord = scrambleWord(currentWord);
    }
    document.getElementById('scrambled-word').textContent = scrambledWord;
    document.getElementById('hint-text').textContent = '';
    document.getElementById('user-input').value = '';
    document.getElementById('feedback').textContent = '';
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 60;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    gameActive = false;
    document.querySelector('.game-container').classList.remove('game-active');
    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('scrambled-word').textContent = 'Game Over!';
    
    // Show game over screen with final score
    const gameOverScreen = document.getElementById('game-over-screen');
    document.getElementById('final-score').textContent = score;
    gameOverScreen.style.display = 'block';
    
    score = 0;
    level = 1;
    streak = 0;
    hintsRemaining = 3;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('streak').textContent = streak;
}

function startGame() {
    gameActive = true;
    document.querySelector('.game-container').classList.add('game-active');
    document.getElementById('start-btn').style.display = 'none';
    score = 0;
    level = 1;
    streak = 0;
    hintsRemaining = 3;
    updateDisplay();
    startTimer();
    newGame();
}

document.getElementById('start-btn').addEventListener('click', startGame);

document.getElementById('submit-btn').addEventListener('click', () => {
    if (!gameActive) return;
    const userInput = document.getElementById('user-input').value.toUpperCase();
    const feedback = document.getElementById('feedback');
    
    if (userInput === currentWord) {
        score += 10 * level;
        streak++;
        if (streak % 3 === 0) {
            level++;
            hintsRemaining++;
        }
        feedback.textContent = '✨ Correct! ✨';
        feedback.className = 'feedback correct';
        updateDisplay();
        newGame();
    } else {
        streak = 0;
        feedback.textContent = '❌ Try again!';
        feedback.className = 'feedback incorrect';
        updateDisplay();
    }
});

document.getElementById('hint-btn').addEventListener('click', () => {
    if (!gameActive) return;
    if (hintsRemaining > 0) {
        const currentHint = wordCategories[currentCategory].find(w => w.word === currentWord).hint;
        document.getElementById('hint-text').textContent = `Hint (${hintsRemaining} remaining): ${currentHint}`;
        hintsRemaining--;
    } else {
        document.getElementById('hint-text').textContent = 'No hints remaining!';
    }
});

document.getElementById('skip-btn').addEventListener('click', () => {
    if (!gameActive) return;
    streak = 0;
    updateDisplay();
    newGame();
});

document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && gameActive) {
        document.getElementById('submit-btn').click();
    }
});

document.getElementById('play-again-btn').addEventListener('click', () => {
    document.getElementById('game-over-screen').style.display = 'none';
    startGame();
});

document.getElementById('back-btn').addEventListener('click', () => {
    // Reset game state
    clearInterval(timer);
    gameActive = false;
    score = 0;
    level = 1;
    streak = 0;
    hintsRemaining = 3;
    timeLeft = 60;
    
    // Update display
    updateDisplay();
    document.getElementById('time').textContent = '60';
    document.getElementById('scrambled-word').textContent = '';
    document.getElementById('hint-text').textContent = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('user-input').value = '';
    
    // Show start button and remove game-active class
    document.getElementById('start-btn').style.display = 'block';
    document.querySelector('.game-container').classList.remove('game-active');
    
    // Hide game over screen if it's visible
    document.getElementById('game-over-screen').style.display = 'none';
    
    // Switch back to category page
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('category-page').style.display = 'block';
});