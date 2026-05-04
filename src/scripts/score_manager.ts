    import {GameCard} from "./game_card.class";
    
    /**
     * This function updates the score for the current player when a match is found. 
     */
    export function updateScore(nextPlayer: "Blue" | "Orange" | null, score: { Blue: number; Orange: number }): { Blue: number; Orange: number } {
        if (nextPlayer) {
            score[nextPlayer] += 1;
            updateScoreDisplay(score);
        }
        return score;
    }


    /**
     * This function updates the score display in the DOM for both players.
     */
    export function updateScoreDisplay(score: { Blue: number; Orange: number }): void {
        const blueScoreElement: HTMLElement | null = document.getElementById("score_blue");
        const orangeScoreElement: HTMLElement | null = document.getElementById("score_orange");
        if (blueScoreElement) {
            blueScoreElement.textContent = score.Blue.toString();
        }
        if (orangeScoreElement) {
            orangeScoreElement.textContent = score.Orange.toString();
        }
    }


    /**
     * This function checks if all cards have been matched and, if so, determines the winner based on the scores and stores the results in local storage.
     */
    export function getWinnerIfAllCardsMatched(matchedCards: GameCard[], cards: GameCard[], score: { Blue: number; Orange: number }): void {
        if (matchedCards.length === cards.length) {
            const winner = score.Blue > score.Orange ? "Blue Player" : score.Orange > score.Blue ? "Orange Player" : "No one, it's a tie";
            storeResultsInLocalStorage(winner, score);
            setTimeout(() => {
                window.location.href = "../html/game_over.html";
            }, 2000);
        }
    }


    /**
     * This function stores the game results, including the winner and the final scores for both players, in local storage under the key "memory_game_results".
     */
    function storeResultsInLocalStorage(winner: string, score: { Blue: number; Orange: number }): void {
        const gameResults: { winner: string | null; score: { Blue: number; Orange: number } } = {
            winner: winner,
            score: score
        };
        localStorage.setItem("memory_game_results", JSON.stringify(gameResults));
    }


    /**
     * This function resets the game results in local storage by setting the "memory_game_results" key to an 
     * initial state with no winner and zero scores for both players. This is useful for starting a new game 
     * with a clean slate.
     */
    export function resetGameResultsInLocalStorage(): void {
        const initialResults = {
            winner: null,
            score: {
                Blue: 0,
                Orange: 0
            }
        };
        localStorage.setItem("memory_game_results", JSON.stringify(initialResults));
    }