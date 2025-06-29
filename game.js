const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-Btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");

const startGameBtn = document.querySelector("#startGameBtn");
const playerXInput = document.querySelector("#playerX");
const playerOInput = document.querySelector("#playerO");
const turnIndicator = document.querySelector("#turn-indicator");
const modeRadios = document.querySelectorAll('input[name="mode"]');

let playerX = "Player X";
let playerO = "Player O";
let currentPlayer = "X";
let gameStarted = false;
let singlePlayer = true;
let gameOver = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

// Game mode switch
modeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        singlePlayer = document.querySelector('input[name="mode"]:checked').value === "single";
        playerOInput.disabled = singlePlayer;
        playerOInput.placeholder = singlePlayer ? "Computer (O)" : "Opponent Name (O)";
    });
});

// Game start
startGameBtn.addEventListener("click", () => {
    playerX = playerXInput.value.trim() || "Player X";
    playerO = singlePlayer ? "Computer" : playerOInput.value.trim() || "Player O";
    currentPlayer = "X";
    gameOver = false;
    gameStarted = true;
    startGameBtn.disabled = true;
    playerXInput.disabled = true;
    playerOInput.disabled = true;
    updateTurnDisplay();
    clearBoard();
});

// Reset / New Game
const resetGame = () => {
    clearBoard();
    gameOver = false;
    currentPlayer = "X";
    updateTurnDisplay();
};

newGameBtn.addEventListener("click", () => {
    resetGame();
    startGameBtn.disabled = false;
    playerXInput.disabled = false;
    playerOInput.disabled = singlePlayer;
    gameStarted = false;
    msgContainer.classList.remove("show");
});

resetBtn.addEventListener("click", () => {
    resetGame();
    msgContainer.classList.remove("show");
});

// Clear & re-enable board
const clearBoard = () => {
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
        box.style.backgroundColor = "";
        box.classList.remove("played", "winner");
    });
};


// Turn indicator
const updateTurnDisplay = () => {
    if (!gameStarted || gameOver) return;
    const name = currentPlayer === "X" ? playerX : playerO;
    turnIndicator.innerText = `${name}'s Turn (${currentPlayer})`;
};

// Winner check
const checkWinner = () => {
    for (let [a, b, c] of winPatterns) {
        if (
            boxes[a].innerText &&
            boxes[a].innerText === boxes[b].innerText &&
            boxes[b].innerText === boxes[c].innerText
        ) {
            boxes[a].classList.add("winner");
            boxes[b].classList.add("winner");
            boxes[c].classList.add("winner");

            declareWinner(boxes[a].innerText);
            return true;
        }
    }
    return false;
};

const declareWinner = (symbol) => {
    const winnerName = symbol === "X" ? playerX : playerO;
    msg.innerText = `🎉 ${winnerName} Wins!`;
    msgContainer.classList.add("show");
    disableAllBoxes();
    gameOver = true;
    updateTurnDisplay();
};

const checkDraw = () => {
    const isDraw = [...boxes].every(box => box.innerText !== "");
    if (isDraw && !gameOver) {
        msg.innerText = "😐 It's a Draw!";
        msgContainer.classList.add("show");
        gameOver = true;
    }
};

const disableAllBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

// Simple AI (first available)
const aiMove = () => {
    if (gameOver || currentPlayer !== "O") return;

    const emptyBoxes = [...boxes].filter(box => box.innerText === "");
    if (emptyBoxes.length === 0) return;

    const move = emptyBoxes[0];
    move.innerText = "O";
move.classList.add("played");

    move.disabled = true;

    if (!checkWinner()) {
        currentPlayer = "X";
        updateTurnDisplay();
        checkDraw();
    }
};

// Main box click logic
boxes.forEach(box => {
    box.addEventListener("click", () => {
        if (!gameStarted || gameOver || box.innerText !== "") return;

                box.innerText = currentPlayer;
                box.classList.add("played");

        box.disabled = true;

        if (checkWinner()) {
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnDisplay();
        checkDraw();

        if (singlePlayer && currentPlayer === "O" && !gameOver) {
            setTimeout(aiMove, 500);
        }
    });
});
