import {GameCard} from "./game_card.class";
import { renderSingleCardsToGameBoard } from "./templates";
import {CODE_VIBES_CARDS_IMAGES, GAMES_CARDS_IMAGES, CODE_VIBES_CARD_BACK, GAMES_CARD_BACK} from "./card_assets";
import {updateScore, updateScoreDisplay, getWinnerIfAllCardsMatched, resetGameResultsInLocalStorage} from "./score_manager";

export class GameBoard {
    private cards: GameCard[];
    private cardBackPath: string | null;
    flippedCards: GameCard[] = [];
    matchedCards: GameCard[] = [];
    nextPlayer: "Blue" | "Orange" | null = null;
    winner: string | null = null;
    score: {
        Blue: number,
        Orange: number};
    imagesCache: {[key: string]: HTMLImageElement} = {};
    settings: {
        theme: "Code vibes theme" | "Gaming theme" | null,
        player: "Blue" | "Orange" | null,
        boardSize: "16 cards" | "24 cards" | "36 cards" | null
    }
    

    /**
     * This function initializes a new instance of the GameBoard class. It sets up the initial state of the 
     * game board, including the score, settings, and winner. It also loads the card images, creates the array 
     * of game cards based on the selected board size, shuffles the cards, renders them to the game board, 
     * adds event listeners for flipping the cards, and sets the initial player for the game.
     */
    constructor(settings: { theme: "Code vibes theme" | "Gaming theme" | null, player: "Blue" | "Orange" | null, boardSize: "16 cards" | "24 cards" | "36 cards" | null }) {
        this.score =  {
            Blue: 0,
            Orange: 0
        };
        this.settings = settings;
        this.winner = null;
        this.cards = [];
        this.cardBackPath = null;
        resetGameResultsInLocalStorage();
        this.loadImages(CODE_VIBES_CARDS_IMAGES);
        this.loadImages(GAMES_CARDS_IMAGES);
        this.createArrayOfGameCards();
        this.getCardBackPathBasedOnTheme();
        this.shuffleCards();
        this.renderCardsToBoard();
        this.flipCardsEventListener();
        this.setNextPlayer();
    }


    /**
    * Loads multiple images from the specified paths.
    * @param {Array<string>} arr - Array of image paths.
    */
    loadImages(arr: string[]): void {
        arr.forEach ((path) => {
            try {
                let img = new Image();
                img.src = path;
                this.imagesCache[path] = img;
            } catch (error) {
                console.error('Error loading image:', error);
            }
        });
    }


    /**
     * This function creates an array of GameCard objects based on the selected board size in the settings.
     */
    createArrayOfGameCards(): void {
        const boardSize: number = this.determineBoardSizeBasedOnSettings();
        this.setGridSizeClassOnField(boardSize);
        for(let i = 0; i < boardSize / 2; i++){
            let imagePath: string = CODE_VIBES_CARDS_IMAGES[i];
            if (this.settings.theme === "Gaming theme") {
                imagePath = GAMES_CARDS_IMAGES[i];
            }
            const card1 = new GameCard(i, imagePath);
            const card2 = new GameCard(i, imagePath);
            this.cards.push(card1, card2);
        }
    }


    /**
     * This function sets the card back image path based on the selected theme in the settings. It checks the theme 
     * and assigns the corresponding card back path to the cardBackPath property of the GameBoard class.
     */
    getCardBackPathBasedOnTheme(): void {
        if (this.settings.theme === "Code vibes theme") {
            this.cardBackPath = CODE_VIBES_CARD_BACK;
        } else if (this.settings.theme === "Gaming theme") {
            this.cardBackPath = GAMES_CARD_BACK;
        } else {
            this.cardBackPath = CODE_VIBES_CARD_BACK;
        }
    }


    /**
     * This function determines the board size based on the selected option in the settings and returns 
     * the corresponding number of cards.
     * @returns {number} - The number of cards for the selected board size.
     */
    determineBoardSizeBasedOnSettings(): number {
        const selectedBoardSize: "16 cards" | "24 cards" | "36 cards" | null = this.settings.boardSize;
        switch (selectedBoardSize) {
            case "16 cards":
                return 16;
            case "24 cards":
                return 24;
            case "36 cards":
                return 36;
            default:                
                return 16;
        }
    }


    /**
     * Sets the grid size class on the game field based on the board size.
     * @param boardSize The number of cards on the board.
     */
    setGridSizeClassOnField(boardSize: number): void {
        const fieldRef: HTMLElement | null = document.getElementById("field");
        if (!fieldRef) return;
        fieldRef.classList.add(`field__${boardSize}-cards`);
    }


    /**
     * This function shuffles the cards in the game board using the Fisher-Yates algorithm.
     */
    shuffleCards(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }


    /**
     * This function renders the cards to the game board by inserting the corresponding HTML for each card into the DOM.
     */
    renderCardsToBoard(): void {
        const fieldRef: HTMLElement | null = document.getElementById("field");
        if (!fieldRef) {
            console.error("Game board container not found");
            return;
        } else {
            this.cards.forEach((card) => {
                const cardHTML: string = renderSingleCardsToGameBoard(card.imagePath, this.cardBackPath!);
                fieldRef.insertAdjacentHTML("beforeend", cardHTML);
            });
        }
    }
    
    
    /**
     * This function adds click event listeners to each card button on the game board. When a card is clicked, it calls the handleCardFlip
     * function to flip the card and then checks if there are two flipped cards to handle matching logic.
    */
   flipCardsEventListener(): void {
       const cardList: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".card");
       cardList.forEach((card, index) => {
           card.addEventListener("click", () => {
                if (this.flippedCards.length === 2) return;
                card.classList.toggle("is-flipped")
                this.handleCardFlip(index, card);
                this.handleTwoFlippedCards();
            });
        }
        );
    }


    /**
     * This function handles the logic for flipping a card when it is clicked. 
     * @param index The index of the clicked card in the cards array.
     * @param button The HTML button element representing the clicked card.
     * @returns void
     */
    handleCardFlip(index: number, button: HTMLButtonElement): void {
        const clickedCard: GameCard = this.cards[index];
        if (clickedCard.isFlipped || clickedCard.isMatched) return;
        clickedCard.changeFlipStatus();
        this.flippedCards.push(clickedCard);
    }


    /**
     * This function checks if there are two flipped cards and handles the logic for matching or flipping them back. 
     */
    handleTwoFlippedCards(): void {
        if (this.flippedCards.length === 2) {
            const [card1, card2] = this.flippedCards;
            if (this.checkMatch(card1, card2)) {
                this.handleMatch(card1, card2);
            } else {
                this.handleNoMatch(card1, card2);
            }
        }
    }


    /**
     * This function checks if the two provided cards are a match by comparing their IDs. If they match, it updates their 
     * matched status and adds them to the matchedCards array.
     * @param card1 The first card to check.
     * @param card2 The second card to check.
     * @returns True if the cards match, false otherwise.
     */
    checkMatch(card1: GameCard, card2: GameCard): boolean {
        if (card1.id === card2.id) {
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedCards.push(card1, card2);
            return true;
        }
        return false;
    }


    /**
     * This function handles the logic for when two flipped cards match. It highlights the matched cards and disables further flipping of those cards.
     * @param card1 The first matched card.
     * @param card2 The second matched card.
     */
    handleMatch(card1: GameCard, card2: GameCard): void {
        this.highlightMatchedCards(card1, card2);
        this.disableFlipMatchingCards(card1, card2);
        this.score = updateScore(this.nextPlayer, this.score);
        updateScoreDisplay(this.score);
        getWinnerIfAllCardsMatched(this.matchedCards, this.cards, this.score);
        this.flippedCards = [];
    }


    /**
     * This function highlights the two matched cards by adding the "is-matched" class to the corresponding button elements 
     * in the DOM after a short delay.
     * @param card1 The first matched card.
     * @param card2 The second matched card.
     */
    highlightMatchedCards(card1: GameCard, card2: GameCard): void {
        const buttonElements: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".card");
        setTimeout(() => {
            buttonElements.forEach((button, index) => {
                const currentCard: GameCard = this.cards[index];
                if (currentCard === card1 || currentCard === card2) {
                    if (!button.classList.contains("is-matched")) {
                        button.classList.add("is-matched");
                    }
                }
            });
        }, 500);
    }


    /**
     * This function disables the flipping of the two matched cards by setting the pointer events to "none" for the corresponding 
     * button elements in the DOM.
     * @param card1 The first matched card.
     * @param card2 The second matched card.
     */
    disableFlipMatchingCards(card1: GameCard, card2: GameCard): void {
        const buttonElements: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".card");
        buttonElements.forEach((button, index) => {
            const currentCard: GameCard = this.cards[index];
            if (currentCard === card1 || currentCard === card2) {
                button.style.pointerEvents = "none";
            }
        });
    }


    /**
     * This function handles the logic for when two flipped cards do not match. It flips the cards back to their original 
     * state after a short delay.
     * @param card1 The first card that did not match.
     * @param card2 The second card that did not match.
     */
    handleNoMatch(card1: GameCard, card2: GameCard): void {
        setTimeout(() => {
            card1.changeFlipStatus();
            card2.changeFlipStatus();
            this.flipBack(card1, card2);                    
            this.showNextPlayerIfLastTwoFlippedCardsDidNotMatch();
            this.flippedCards = [];
        }, 1000);
    }


    /**
     * This function flips the two specified cards back to their original state by removing the "is-flipped" class 
     * from the corresponding button elements in the DOM.
     * @param card1 The first card to flip back.
     * @param card2 The second card to flip back.
     */
    flipBack(card1: GameCard, card2: GameCard): void {
        const buttonElements: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".card");
        buttonElements.forEach((button, index) => {
            const currentCard: GameCard = this.cards[index];
            if (currentCard === card1 || currentCard === card2) {
                if (button.classList.contains("is-flipped")) {
                    button.classList.remove("is-flipped");
                }
            }
        });
    }


    /**
     * This function checks if the last two flipped cards do not match and, if so, it calls the setNextPlayer function 
     * to switch to the next player's turn.
     */
    showNextPlayerIfLastTwoFlippedCardsDidNotMatch(): void {
        if (this.flippedCards.length === 2 && !this.checkMatch(this.flippedCards[0], this.flippedCards[1])) {
            this.setNextPlayer();
        }
    }


    /**
     * This function sets the next player for the game. If there is no next player currently set and a player is defined in the  
     * settings, it sets the next player to the player defined in the settings. Otherwise, it toggles the next player between "Blue" and "Orange".
     */
    setNextPlayer(): void {
        if (this.nextPlayer === null && this.settings.player) {
            this.nextPlayer = this.settings.player;
        } else {
            this.nextPlayer = this.nextPlayer === "Blue" ? "Orange" : "Blue";
        }
        this.updateNextPlayerDisplay();
        this.updateNextPlayerBackgroundColor();
    }


    /**
     * This function updates the display to show which player's turn is next by toggling the visibility of the corresponding player indicators.
     */
    updateNextPlayerDisplay(): void {
        const nextPlayerDisplay: HTMLElement | null = document.getElementById("next-player-display");
        if (!nextPlayerDisplay) return;
        const bluePlayerIndicator: HTMLElement | null = nextPlayerDisplay.querySelector(".next-turn__current-player-blue");
        const orangePlayerIndicator: HTMLElement | null = nextPlayerDisplay.querySelector(".next-turn__current-player-orange");
        if (!bluePlayerIndicator || !orangePlayerIndicator) return;

        if (this.nextPlayer === "Blue") {
            bluePlayerIndicator.style.display = "inline";
            orangePlayerIndicator.style.display = "none";
        } else {
            bluePlayerIndicator.style.display = "none";
            orangePlayerIndicator.style.display = "inline";
        }
    }


    /**
     * This function set the background color of the next player icon.
     */
    updateNextPlayerBackgroundColor(): void {
        const nextPlayerIconWrapper: HTMLElement | null = document.getElementById("current_player_icon_wrapper");
        if (!nextPlayerIconWrapper) return;

        if (this.nextPlayer === "Blue") {
            nextPlayerIconWrapper.classList.add("next-turn__icon-wrapper--blue-background");
            nextPlayerIconWrapper.classList.remove("next-turn__icon-wrapper--orange-background");
        } else {
            nextPlayerIconWrapper.classList.add("next-turn__icon-wrapper--orange-background");
            nextPlayerIconWrapper.classList.remove("next-turn__icon-wrapper--blue-background");
        }
    }
}