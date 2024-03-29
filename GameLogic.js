const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset-btn');
const quitButton = document.getElementById('quit-btn');
const player1Name = document.getElementById('player1-name');
const player1Score = document.getElementById('player1-score');
const player2Name = document.getElementById('player2-name');
const player2Score = document.getElementById('player2-score');
const gameCount = document.getElementById('game-count');
const themeSelect = document.getElementById('theme-select');
const sloganElement = document.getElementById('slogan');

const slogans = [
    "The Ultimate Battle of Wits!",
    "A Game of Strategy and Skill!",
    "Outmaneuver Your Opponent!",
    "The Classic Game, Reinvented!",
    "X's and O's, Endless Possibilities!"
];

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let player1Symbol = 'X';
let player2Symbol = 'O';
let player1Wins = 0;
let player2Wins = 0;
let totalGames = 0;

function updateSlogan() {
    const randomIndex = Math.floor(Math.random() * slogans.length);
    sloganElement.textContent = slogans[randomIndex];
}

function init() {
    const player1 = prompt("Enter Player 1's name:");
    const player2 = prompt("Enter Player 2's name:");

    if (player1 && player2) {
        player1Name.textContent = player1+" : ";
        player2Name.textContent = player2+" : ";

        const symbolChoice = prompt(`${player1}, choose your symbol (X or O):`).toUpperCase();
        if (symbolChoice === 'X') {
            player1Symbol = 'X';
            player2Symbol = 'O';
            currentPlayer = player1Symbol;
        } else if (symbolChoice === 'O') {
            player1Symbol = 'O';
            player2Symbol = 'X';
            currentPlayer = player2Symbol;
        } else {
            alert('Invalid symbol choice. Defaulting to X for Player 1 and O for Player 2.');
        }
    } else {
        alert('Player names cannot be empty. Using default names.');
        player1Name.textContent = 'Player 1 : ';
        player2Name.textContent = 'Player 2 : ';
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }

    if (!gameBoard.includes('')) {
        return 'tie';
    }

    return null;
}

function handleCellClick(e) {
    const cellIndex = e.target.getAttribute('data-index');

    if (gameBoard[cellIndex] !== '' || gameOver) {
        return;
    }

    gameBoard[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());

    const winner = checkWinner();

    if (winner) {
        gameOver = true;
        if (winner === 'tie') {
            messageElement.textContent = "It's a tie!";
            totalGames++;
            gameCount.textContent = `Total Games: ${totalGames}`;
            setTimeout(resetGame, 2000);

        } else {
            messageElement.textContent = `${winner === player1Symbol ? player1Name.textContent : player2Name.textContent} wins!`;
            highlightWinningCells(winner);
            if (winner === player1Symbol) {
                player1Wins++;
                player1Score.textContent = player1Wins;
            } else {
                player2Wins++;
                player2Score.textContent = player2Wins;
            }
            totalGames++;
            gameCount.textContent = `Total Games: ${totalGames}`;
            setTimeout(resetGame, 2000);
        }
    } else {
        currentPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;
    }
}

function highlightWinningCells(winner) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6] 
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            gameBoard[a] === winner &&
            gameBoard[b] === winner &&
            gameBoard[c] === winner
        ) {
            cells[a].classList.add('win-animation');
            cells[b].classList.add('win-animation');
            cells[c].classList.add('win-animation');
            break;
        }
    }
}

function resetGame() {
    currentPlayer = player1Symbol;
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    messageElement.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win-animation');
    });
}

function quitGame() {
    player1Wins = 0;
    player2Wins = 0;
    totalGames = 0;
    player1Score.textContent = '0';
    player2Score.textContent = '0';
    gameCount.textContent = 'Total Games: 0';
    resetGame();
    init();
}

function applyTheme(theme) {
    document.body.classList.remove('light', 'dark', 'green', 'aqua', 'purple', 'orange');

    switch (theme) {
        case 'light':
            document.body.classList.add('light');
            break;
        case 'dark':
            document.body.classList.add('dark');
            break;
        case 'green':
            document.body.classList.add('green');
            break;
        case 'aqua':
            document.body.classList.add('aqua');
            break;
        case 'purple':
            document.body.classList.add('purple');
            break;
        case 'orange':
            document.body.classList.add('orange');
            break;
        default:
            document.body.style.backgroundColor = theme;
            document.body.style.color = getContrastColor(theme);
    }
}

function getContrastColor(color) {
    const rgb = hexToRgb(color.replace('#', ''));
    const brightness = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    return (brightness > 125) ? '#333' : '#f2f2f2';
}

function hexToRgb(hex) {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

init();
updateSlogan();
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
quitButton.addEventListener('click', quitGame);
themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));