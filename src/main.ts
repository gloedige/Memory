import './styles/style.scss'
import {handleColorOfWinnerNameAndIcon} from './scripts/handle_winner_page'
import {addEventListenersToSettingsOptions} from './scripts/settings_manager';
import { resolveAssetPath } from "./scripts/asset_paths";
import { GameBoard } from "./scripts/board.class";

const exitBtn = document.getElementById("exit_game_button")
const backToGameBtn = document.getElementById("back_to_game")
export let settings: {
    theme: "Code vibes theme" | "Gaming theme" | null,
    player: "Blue" | "Orange" | null,
    boardSize: "16 cards" | "24 cards" | "36 cards" | null
} = {
    theme: null,
    player: null,
    boardSize: null
}

init();


/**
 * Initializes the game board by adding event listeners to the cards and buttons
 * - Adds a click event listener to the game field to handle card flipping
 * - Adds click event listeners to the exit game button and back to game button to show and hide the exit game dialog
 * - Toggles the "is-flipped" class on the clicked card to flip it
 * - Shows the exit game dialog when the exit game button is clicked
 * - Hides the exit game dialog when the back to game button is clicked
 */
function init(){
    exitBtn?.addEventListener("click", showDialog)
    backToGameBtn?.addEventListener("click", hideDialog);
    addEventListenersToSettingsOptions(settings);
}


/**
 * Shows the exit game dialog
 */
function showDialog(){
    const dialog = document.getElementById("dialog")
    if(dialog){
        dialog.classList.add("is-visible");
    }
}


/**
 * Hides the exit game dialog
 */
function hideDialog(){
    const dialog = document.getElementById("dialog")
    if(dialog){
        dialog.classList.remove("is-visible");
    }
}


/**
 * This function initializes the game by adding event listeners to the game field and buttons. It handles card flipping and 
 * showing/hiding the exit game dialog.
 */
document.addEventListener("DOMContentLoaded", () => {
    getSettingsFromLocalStorage();
    setThemeBasedOnSettings();
    setThemeIconsBasedOnSettings();
    setDialogBtnTextBasedOnSettings();
    handleGameBoardInitialization();
    const { winner, score }: { winner: string, score: { Blue: number, Orange: number } } = getGameResultsFromLocalStorage();
    handleGameOverPageInitialization(score);
    handleWinnerPageInitialization(winner);
});


/**
 * This function retrieves the game settings from local storage and updates the settings property of the GameBoard instance.
 * If no settings are found, it logs a warning message and keeps the default settings.
 */
function getSettingsFromLocalStorage(): void {
    const storedSettings: string | null = localStorage.getItem("memory_game_settings");
    if (!storedSettings || window.location.pathname.includes('settings.html') || window.location.pathname.includes('index.html')) return;
    settings = JSON.parse(storedSettings);
}



/**
 * This function sets the theme of the game based on the selected theme in the settings object. It adds the appropriate 
 * CSS class to the body element.
 */
function setThemeBasedOnSettings(): void {
    const bodyElement: HTMLElement | null = document.querySelector("body");
    if (!bodyElement || window.location.pathname.includes('settings.html') || window.location.pathname.includes('index.html')) return;
    if (settings.theme === "Code vibes theme") {
        bodyElement.classList.add("code-vibes-theme");
    } else if (settings.theme === "Gaming theme") {
        bodyElement.classList.add("gaming-theme");
    }
}


/**
 * This function sets score-board icon sources based on the selected theme.
 */
function setThemeIconsBasedOnSettings(): void {
    const themeIdentifier: "codeVibes" | "gaming" = settings.theme === "Gaming theme" ? "gaming" : "codeVibes";
    const themeDataAttribute: string = themeIdentifier === "gaming" ? "iconGaming" : "iconCodeVibes";
    const themeIconRefs: NodeListOf<HTMLImageElement> = document.querySelectorAll("img[data-icon-code-vibes][data-icon-gaming]");
    themeIconRefs.forEach((iconRef) => {
        const sourcePath: string | undefined = iconRef.dataset[themeDataAttribute];
        if(sourcePath){
            iconRef.src = resolveAssetPath(sourcePath);
        }
    });
}


/**
 * This function sets the text content of the buttons in the exit game dialog based on the selected theme in the settings object.
 */
function setDialogBtnTextBasedOnSettings(): void {
    const backToGameBtnRef: HTMLButtonElement | null = document.getElementById("back_to_game") as HTMLButtonElement | null;
    const exitGameBtnRef: HTMLButtonElement | null = document.getElementById("exit_game_dialog_btn") as HTMLButtonElement | null;
    if (backToGameBtnRef && exitGameBtnRef) {
        if (settings.theme === "Gaming theme") {
            backToGameBtnRef.textContent = "No, back to game";
            exitGameBtnRef.textContent = "Yes, quit game";
        } else if (settings.theme === "Code vibes theme") {
            backToGameBtnRef.textContent = "Back to Game";
            exitGameBtnRef.textContent = "Exit Game";
        }
    }
}


/**
 * This function initializes the game board by creating a new GameBoard instance.
 */
function handleGameBoardInitialization(){
    const fieldRef: HTMLElement | null = document.getElementById("field");
    if (!fieldRef) return;
    new GameBoard(settings);
}


/**
 * This function retrieves the game results (winner and score) from local storage. If there are no results in local storage, 
 * it returns default values indicating that no one won and both players have a score of 0.
 * @returns An object containing the winner and the score of both players.
 */
function getGameResultsFromLocalStorage(): { winner: string, score: { Blue: number, Orange: number } }{
    const lastGameResult: string | null = localStorage.getItem("memory_game_results");
    if(!lastGameResult) return { winner: "No one, it's a tie", score: { Blue: 0, Orange: 0 } };
    
    return JSON.parse(lastGameResult);
}


/**
 * This function initializes the game over page by displaying the final scores of both players and then redirecting to the 
 * winner page after a short delay.
 * @param score The final scores of both players.
 * @returns void
 */
function handleGameOverPageInitialization(score: { Blue: number, Orange: number }){
    const gameOverContentRef: HTMLElement | null = document.getElementById("game_over_content");
    if(!gameOverContentRef) return;
        if(score){
            const blueScoreRef: HTMLElement | null = document.getElementById("final_score_blue");
            const orangeScoreRef: HTMLElement | null = document.getElementById("final_score_orange");
            if(blueScoreRef){
                blueScoreRef.textContent = `${score.Blue}`;
            }
            if(orangeScoreRef){
                orangeScoreRef.textContent = `${score.Orange}`;
            }
        }
    setHeadlineColorBasedOnTheme();
    setTimeout(() => {
        window.location.href = "../html/winner.html";
    }, 2000);
}


/**
 * This function sets the case of the headline text in the game over page based on the selected theme in the settings object.
 * @returns - void
 */
function setHeadlineColorBasedOnTheme(){
    const headlineRef: HTMLElement | null = document.querySelector(".game-over-headline");
    if (!headlineRef) return;
    if (settings.theme === "Gaming theme"){
        headlineRef.textContent = headlineRef.textContent?.toUpperCase() || "GAME OVER";
    } else if (settings.theme === "Code vibes theme"){
        headlineRef.textContent = headlineRef.textContent || "Game Over";
    }
}


/**
 * This function initializes the winner page by setting the winner's name and updating the colors of the winner's name and 
 * icon based on who won the game.
 * @param winner The name of the winning player.
 * @returns void
 */
function handleWinnerPageInitialization(winner: string){
    const winnerContentRef: HTMLElement | null = document.getElementById("winner_content");
        if (!winnerContentRef) return;
        setWinnerNameInWinnerPage(winner);
    handleColorOfWinnerNameAndIcon(winner, settings.theme);
        setButtonTextBasedOnTheme();
}


/**
 * This function sets the winner's name in the winner page by updating the text content of the element with the id "winner_name" 
 * to display the name of the winning player.
 * @param winner The name of the winning player.
 * @returns void
 */
function setWinnerNameInWinnerPage(winner: string){
    const winnerNameRef: HTMLElement | null = document.getElementById("winner_name");
        if(winnerNameRef){
            if (settings.theme === "Code vibes theme"){
                winnerNameRef.textContent = `${winner}`.toUpperCase();
            } else if (settings.theme === "Gaming theme"){
                winnerNameRef.textContent = `${winner}`;
            }
        }
}


/**
 * This function sets the text content of the button in the exit game dialog based on the selected theme in the settings object.
 */
function setButtonTextBasedOnTheme(): void {
    const backToStartBtnRef: HTMLButtonElement | null = document.getElementById("exit_game_button") as HTMLButtonElement | null;
    if (backToStartBtnRef) {
        if (settings.theme === "Gaming theme") {
            backToStartBtnRef.textContent = "Home";
        } else if (settings.theme === "Code vibes theme") {
            backToStartBtnRef.textContent = "Back to Start";
        }
    }
}