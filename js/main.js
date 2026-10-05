import { createShuffledCards } from "./cards.js";

let shuffledCards = createShuffledCards();

let firstCard = null;
let secondCard = null;
let moves = 0;
let pairs = 0;
let isLocked = false;
let mismatchTimer = null;
let matchedCards = [];

function createCard(cardData, movesCounter, pairsCounter, onVictory) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = cardData.id;

    // отркываем выбранную карточку
    card.addEventListener("click", () => {
        // проверка карточки
        if (isLocked) {
            return;
        } 
        if (card.classList.contains("open")) {
            return;
        }

        // если это первая открытая карточка
        if (firstCard === null) {
            card.classList.add("open");
            firstCard = card;
        } else {
            card.classList.add("open");
            secondCard = card;
            moves += 1;
            movesCounter.textContent = `Moves: ${moves}`;

            // если карты совпадают
            if (firstCard.dataset.id === secondCard.dataset.id) {
                pairs += 1;
                matchedCards.push(firstCard, secondCard);
                firstCard = null;
                secondCard = null;
                pairsCounter.textContent = `Pairs: ${pairs} / 8`;

                if (pairs === 8) {
                    onVictory(moves);
                }

            } else {
                isLocked = true;
                mismatchTimer = setTimeout(() => {
                    firstCard.classList.remove("open");
                    secondCard.classList.remove("open");
                    firstCard = null;
                    secondCard = null;
                    isLocked = false;
                    mismatchTimer = null;
                }, 1000);
            }
        }
    });

    // стороны карточки
    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";
    
    const frontCard = document.createElement("div");
    frontCard.className = "card-front";

    const imgFront = document.createElement("img");
    imgFront.src = "images/image 31.svg";
    imgFront.alt = "Card front image";

    const backCard = document.createElement("div");
    backCard.className = "card-back";

    const imgBack = document.createElement("img");
    imgBack.src = cardData.image;
    imgBack.alt = "Card back image";

    // формируем структуру карточки
    frontCard.appendChild(imgFront);
    backCard.appendChild(imgBack);
    cardInner.append(frontCard, backCard);
    card.appendChild(cardInner);
    return card;
}

function createApp() {
    // div app
    const app = document.createElement("div");
    app.className = "app";

    // app header
    const header = document.createElement("header");

    // app header buttons
    const newGameButton = document.createElement("button");
    newGameButton.textContent = "New Game";
    header.appendChild(newGameButton);

    // сброс игры
    newGameButton.addEventListener("click", () => {
        startNewGame(movesCounter, pairsCounter, gameBoard, onVictory);
    });

    // доска результатов
    const leaderboardButton = document.createElement("button");
    leaderboardButton.textContent = "Leaderboard";
    header.appendChild(leaderboardButton);

    leaderboardButton.addEventListener("click", () => {
        const leaderboard = createLeaderboardModal();
        openModal(leaderboard);
    })

    // app game
    const game = document.createElement("div");
    game.className = "game";

    // app game game-info
    const gameInfo = document.createElement("div");
    gameInfo.className = "game-info";

    // app game game-info counters
    const movesCounter = document.createElement("p");
    movesCounter.textContent = `Moves: ${moves}`;
    
    const pairsCounter = document.createElement("p");
    pairsCounter.textContent = `Pairs: ${pairs} / 8`;
    
    gameInfo.append(movesCounter, pairsCounter);

    // app game game-board
    const gameBoard = document.createElement("div");
    gameBoard.className = "game-board";

    // вызов модалки
    const onVictory = (moves) => {
        const victoryModal = createVictoryModal(moves, movesCounter, pairsCounter, gameBoard, onVictory);
        const result = createResult(moves);

        saveResult(result);
        openModal(victoryModal);
    }
    
    // создаем и добавляем карточки
    shuffledCards.forEach(cardData => {
        gameBoard.append(createCard(cardData, movesCounter, pairsCounter, onVictory));
    })

    game.append(gameInfo, gameBoard);
    app.appendChild(header);
    app.appendChild(game);
    document.body.appendChild(app);
}

function startNewGame(movesCounter, pairsCounter, gameBoard, onVictory) {
    // сброс таймера 
    if (mismatchTimer) {
        clearTimeout(mismatchTimer);
        mismatchTimer = null;
    }

    // закрываем все карточки
    matchedCards.forEach(card => {
        card.classList.remove("open");
    });
    matchedCards = [];

    if (firstCard) {
        firstCard.classList.remove("open");
        firstCard = null;
    }
    if (secondCard) {
        secondCard.classList.remove("open");
        secondCard = null;
    }

    isLocked = false;

    // обнуляем счетчики
    moves = 0;
    movesCounter.textContent = `Moves: ${moves}`;
    pairs = 0;
    pairsCounter.textContent = `Pairs: ${pairs} / 8`;

    // перемешиваем карточки
    shuffledCards = createShuffledCards();

    // очищаем и создаем новое игровое поле
    gameBoard.replaceChildren();
    shuffledCards.forEach(cardData => {
        gameBoard.append(createCard(cardData, movesCounter, pairsCounter, onVictory));
    });
}

createApp();

function createModal() {
    const modal = document.createElement("div");
    modal.className = "modal";
    
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    
    modal.appendChild(modalContent);

    // закрытие по оверлею
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal, handleEscape);
        }
    });

    // закрытие по Esc
    const handleEscape = (event) => {
        if (event.key === "Escape") {
            closeModal(modal, handleEscape);
        }
    }
    
    document.addEventListener("keydown", handleEscape);
    
    return { modal, modalContent, handleEscape };
}

function createVictoryModal(moves, movesCounter, pairsCounter, gameBoard, onVictory) {
    const { modal, modalContent, handleEscape } = createModal();

    // текст сообщения
    const message = document.createElement("div");
    message.className = "message";

    const congrats = document.createElement("h2");
    congrats.textContent = "You won!";
    
    const txtMoves = document.createElement("p");
    txtMoves.textContent = `Total moves: ${moves}`;

    message.append(congrats, txtMoves);

    // кнопки
    const buttons = document.createElement("div");
    buttons.className = "buttons";

    const newGameButton = document.createElement("button");
    newGameButton.textContent = "New Game";
    newGameButton.addEventListener("click", () => {
        startNewGame(movesCounter, pairsCounter, gameBoard, onVictory);
        closeModal(modal, handleEscape);
    });

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "Close";

    closeButton.addEventListener("click", () => {
        closeModal(modal, handleEscape);
    });

    buttons.append(newGameButton, closeButton);
    modalContent.append(message, buttons);

    return modal;
}

function openModal(modal) {
    document.body.appendChild(modal);   
    document.body.style.overflow = 'hidden';
    modal.classList.add("open");
}

function closeModal(modal, handleEscape) {
    modal.classList.remove("open");
    document.body.style.overflow = '';
    
    document.removeEventListener("keydown", handleEscape);
}

function createResult(moves) {
    // форматируем дату
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    const formattedDate = `${day}.${month}.${year}`;

    const result = {
        moves: moves,
        date: formattedDate
    }

    return result;
}

function getResults() {
    const savedResults = localStorage.getItem('gameResults');
    const allResults = savedResults ? JSON.parse(savedResults) : [];

    return allResults;
}

function parseDate(dateString) {
    const [day, month, year] = dateString.split('.');
    return new Date(year, month - 1, day);
}

function saveResult(result) {
    const results = getResults();
    results.push(result);
    
    localStorage.setItem('gameResults', JSON.stringify(results));
}

function sortResults(results) {
    const sortedResults = [...results].sort((a, b) => {
        if (a.moves !== b.moves) {
            return a.moves - b.moves;
        } else {
            return parseDate(a.date) - parseDate(b.date);
        }
    });

    return sortedResults;
}

function getTopResults() {
    const results = getResults();
    const sortedResults = sortResults(results);
    const topResults = sortedResults.slice(0, 10);

    return topResults;
}

function createLeaderboardModal() {
    const { modal, modalContent, handleEscape } = createModal();

    const title = document.createElement('h2');
    title.textContent = 'Leaderboard';

    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'leaderboard-results';

    const headerRow = document.createElement("div");
    headerRow.className = "resultRow";

    const placeHeader = document.createElement("span");
    placeHeader.className = "place";
    placeHeader.textContent = "Place";

    const movesHeader = document.createElement("span");
    movesHeader.className = "moves";
    movesHeader.textContent = "Moves";

    const dateHeader = document.createElement("span");
    dateHeader.className = "date";
    dateHeader.textContent = "Date";

    headerRow.append(placeHeader, movesHeader, dateHeader);
    resultsContainer.appendChild(headerRow);

    const results = getTopResults();

    if (results.length === 0) {
        const emptyMessage = document.createElement('h3');
        emptyMessage.textContent = 'No games yet';
        resultsContainer.appendChild(emptyMessage);
    } else {
        results.forEach((result, index) => {
            const resultRow = document.createElement('div');
            resultRow.className = 'resultRow';
    
            const place = document.createElement('span');
            place.className = 'place';
            place.textContent = index +1;
    
            const moves = document.createElement('span');
            moves.className = 'moves';
            moves.textContent = result.moves;
            
            const date = document.createElement('span');
            date.className = 'date';
            date.textContent = result.date;
    
            resultRow.append(place, moves, date);
            resultsContainer.appendChild(resultRow);
        });
    }

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "Close";

    closeButton.addEventListener("click", () => {
        closeModal(modal, handleEscape);
    });


    modalContent.append(title, resultsContainer, closeButton);

    return modal;
}