import {GameCard} from "./game_card.class";
import { renderSingleCardsToGameBoard } from "./templates";

export class GameBoard {
        CODE_VIBES_CARDS_IMAGES: string[] = [
        "../assets/images/code_vibes_theme/code_vibes_theme_01.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_02.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_03.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_04.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_05.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_06.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_07.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_08.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_09.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_10.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_11.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_12.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_13.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_14.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_15.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_16.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_17.svg",
        "../assets/images/code_vibes_theme/code_vibes_theme_18.svg"
    ]

    private cards: GameCard[];
    flippedCards: GameCard[] = [];
    matchedCards: GameCard[] = [];
    imagesCache: {[key: string]: HTMLImageElement} = {};
    settings: {
        theme: "Code vibes theme" | "Gaming theme" | null,
        player: "Blue" | "Orange" | null,
        boardSize: "16 cards" | "24 cards" | "36 cards" | null
    }

    constructor() {
        this.settings = {
            theme: null,
            player: null,
            boardSize: null
        };
        this.cards = [];
        this.loadImages(this.CODE_VIBES_CARDS_IMAGES);
        this.createArrayOfGameCards();
        this.shuffleCards();
        this.renderCardsToBoard();
        this.flipCardsEventListener();
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
        const boardSize = this.determineBoardSizeBasedOnSettings();
        this.setGridSizeClassOnField(boardSize);
        for(let i = 0; i < boardSize / 2; i++){
            const imagePath = this.CODE_VIBES_CARDS_IMAGES[i];
            const card1 = new GameCard(i, imagePath);
            const card2 = new GameCard(i, imagePath);
            this.cards.push(card1, card2);
        }
    }


    /**
     * This function determines the board size based on the selected option in the settings and returns 
     * the corresponding number of cards.
     * @returns {number} - The number of cards for the selected board size.
     */
    determineBoardSizeBasedOnSettings(): number {
        this.getSettingsFromLocalStorage();
        const selectedBoardSize = this.settings.boardSize;
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
        const fieldRef = document.getElementById("field");
        if (!fieldRef) return;
        fieldRef.classList.add(`field__${boardSize}-cards`);
    }


    /**
     * This function retrieves the game settings from local storage and updates the settings property of the GameBoard instance.
     * If no settings are found, it logs a warning message and keeps the default settings.
     */
    getSettingsFromLocalStorage(): void {
        const storedSettings = localStorage.getItem("memory_game_settings");
        if (storedSettings) {
            this.settings = JSON.parse(storedSettings);
        } else {
            console.warn("No settings found in local storage, using default settings.");
        }
    }


    /**
     * This function shuffles the cards in the game board using the Fisher-Yates algorithm.
     */
    shuffleCards(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }


    /**
     * This function renders the cards to the game board by inserting the corresponding HTML for each card into the DOM.
     */
    renderCardsToBoard(): void {
        const fieldRef = document.getElementById("field");
        if (!fieldRef) {
            console.error("Game board container not found");
            return;
        } else {
            this.cards.forEach((card) => {
                const cardHTML = renderSingleCardsToGameBoard(card.imagePath);
                fieldRef.insertAdjacentHTML("beforeend", cardHTML);
            });
        }  
        
    }


    //TODO: Funktion muss auf 14loc eingekürzt werden.
    flipCardsEventListener(): void {
    const buttonElements: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".card");
    buttonElements.forEach((button, index) => {
        button.addEventListener("click", () => {
            const clickedCard: GameCard = this.cards[index];
            if (clickedCard.isFlipped || clickedCard.isMatched) return;
            clickedCard.changeFlipStatus();
            this.flippedCards.push(clickedCard);
            if (this.flippedCards.length === 2) {
                const [card1, card2] = this.flippedCards;
                if (this.checkMatch(card1, card2)) {
                    console.log("It's a match!");
                } else {
                    console.log("Not a match, flipping back...");
                    setTimeout(() => {
                        card1.changeFlipStatus();
                        card2.changeFlipStatus();
                        this.flipBack(card1, card2);                    
                    }, 1000);
                }
                this.flippedCards = [];
            }
        });
    }
    );
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


    resetBoard(): void {
        this.flippedCards = [];
        this.matchedCards = [];
        this.cards.forEach(card => {
            card.isFlipped = false;
            card.isMatched = false;
        });
        this.shuffleCards(); // ggf. nicht erforderlich, je nachdem, ob du die Karten nach jedem Spiel neu mischen möchtest
    }
}