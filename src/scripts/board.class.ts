import {GameCard} from "./game_card.class";
import { renderSingleCardsToGameBoard } from "./templates";
import { settings } from "../main";

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

    constructor() {
        this.cards = [];
        this.loadImages(this.CODE_VIBES_CARDS_IMAGES);
        this.createArrayOfGameCards();
        this.shuffleCards();
        this.renderCardsToBoard();
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
        const selectedBoardSize = settings.boardSize;
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




    checkMatch(card1: GameCard, card2: GameCard): boolean {
        if (card1.id === card2.id) {
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedCards.push(card1, card2);
            return true;
        }
        return false;
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