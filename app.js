const cards = document.querySelectorAll(".card");

let matchedCard = 0;
let cardOne, cardTwo;
let disableDeck = false;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

const winModal = document.getElementById('winModal');
const stats = document.getElementById('stats');
const playAgainBtn = document.getElementById('playAgainBtn');

const confettiCanvas = document.getElementById('confettiCanvas');
let confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiActive = false;
let confettiAnimationFrame;

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    timer = 0;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);

function randomColor() {
    const colors = ['#FFD700', '#FF69B4', '#00CFFF', '#FF6347', '#7CFC00', '#FFB347', '#A020F0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createConfettiParticle() {
    return {
        x: Math.random() * confettiCanvas.width,
        y: -10,
        r: Math.random() * 6 + 4,
        d: Math.random() * 40 + 10,
        color: randomColor(),
        tilt: Math.random() * 10 - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0
    };
}

function startConfetti() {
    resizeConfetti();
    confettiParticles = [];
    for (let i = 0; i < 120; i++) {
        confettiParticles.push(createConfettiParticle());
    }
    confettiCanvas.style.display = 'block';
    confettiActive = true;
    runConfetti();
}

function stopConfetti() {
    confettiActive = false;
    confettiCanvas.style.display = 'none';
    cancelAnimationFrame(confettiAnimationFrame);
}

function runConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = 0; i < confettiParticles.length; i++) {
        let p = confettiParticles[i];
        confettiCtx.beginPath();
        confettiCtx.ellipse(p.x, p.y, p.r, p.r/2, p.tilt, 0, 2 * Math.PI);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fill();
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(0.01 * p.d);
        p.tiltAngle += p.tiltAngleIncremental;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        if (p.y > confettiCanvas.height) {
            confettiParticles[i] = createConfettiParticle();
            confettiParticles[i].y = -10;
        }
    }
    if (confettiActive) {
        confettiAnimationFrame = requestAnimationFrame(runConfetti);
    }
}

function showWinModal() {
    stats.textContent = `You finished in ${moves} moves and ${formatTime(timer)}!`;
    winModal.style.display = 'flex';
    startConfetti();
}

function hideWinModal() {
    winModal.style.display = 'none';
    stopConfetti();
}

playAgainBtn.addEventListener('click', () => {
    hideWinModal();
    shuffleCard();
    moves = 0;
    resetTimer();
    gameStarted = false;
    stopConfetti();
});

function flipCard(e) {
    let clickedCard = e.target; // getting user clicked card
    if(clickedCard !== cardOne && !disableDeck){
        clickedCard.classList.add("flip");
        if(!cardOne){
            if (!gameStarted) {
                gameStarted = true;
                resetTimer();
                startTimer();
            }
            //return the cardOne value to clickedCard
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector("img").src,
        cardTwoImg = cardTwo.querySelector("img").src;
        moves++;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2){
    if(img1 === img2){ // if two cards img matched;
        matchedCard++; //increment matched value 1
        //if matched value is 8 that means user has matched all the cards (8*2 = 16 cards)
        if(matchedCard == 8 ){
           setTimeout(() => {
            stopTimer();
            showWinModal();
           }, 800);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = ""; // setting both card value to blank
        return disableDeck = false;
    }

    setTimeout(() => {
        //adding shake class to both card after 400ms
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    },400);

    setTimeout(() => {
        //removing both shake & flip classes from the both card after 1.2 seconds
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = ""; // setting both card value to blank
        disableDeck = false;
    },1200);

}

function shuffleCard(){
    matchedCard = 0;
    cardOne = cardTwo = "";
    //creating array of 16 items and each item is repeated twice
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1); //sorting array item randomly 

    //removing flip class from all cards and pasing random images to each card
    disableDeck = false;

    cards.forEach((card, index) =>{ 
        card.classList.remove("flip");
        let imgTag = card.querySelector("img");
        imgTag.src = `Images/img-${arr[index]}.png`;
        card.addEventListener("click",flipCard);
    });
    moves = 0;
    resetTimer();
    gameStarted = false;
    hideWinModal();
}

shuffleCard();

cards.forEach(card =>{ //adding click event to all cards
    card.addEventListener("click",flipCard);
});

// Dark mode toggle logic for checkbox
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
} else {
    darkModeToggle.checked = false;
}

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});