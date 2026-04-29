import './styles/style.scss'
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
    const fieldRef = document.getElementById("field")
    if(fieldRef){
        fieldRef.addEventListener("click", (event) => {
            const card = (event.target as HTMLElement).closest(".card") as HTMLButtonElement
            if(card){
                card.classList.toggle("is-flipped")
            };
        });
    }

    exitBtn?.addEventListener("click", showDialog)
    backToGameBtn?.addEventListener("click", hideDialog)
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
 * This function hide all icons for unchecked radio buttons and shows them for checked radio buttons.
 * @param container The container element within which to set the active option icon.
 * @param input The input element that triggered the change event.
 */
function setIconInSettingsOptions(container: Element, input: HTMLInputElement){
    hideAllIconsInOptionsContainer(container);
    const optionsContainerElement: HTMLElement | null = getOptionsContainerElement(input);
    if(optionsContainerElement && input.checked){
        optionsContainerElement.classList.add("options-container__element--active_option_icon");
    }
}


/**
 * This function takes a container element as a parameter and hides all icons within that container by removing the 
 * "options-container__element--active_option_icon" class from each element with the class "options-container__element".
 * @param container The container element within which to hide all icons.
 */
function hideAllIconsInOptionsContainer(container: Element){
    const optionsContainerElements: NodeListOf<Element> | null = container.querySelectorAll(".options-container__element");
    optionsContainerElements.forEach((element) => {
        element.classList.remove("options-container__element--active_option_icon");
    });
}


/**
 * This function takes an input element as a parameter and returns the closest parent element with the class "options-container__element". 
 * @param input The input element for which to find the closest parent element with the class "options-container__element".
 * @returns The closest parent element with the class "options-container__element" or null if no such element is found.
 */
function getOptionsContainerElement(input: HTMLInputElement): HTMLElement | null{
    const optionsContainerElement: Element | null = input.closest(".options-container__element");
    return optionsContainerElement as HTMLElement | null;
}


/**
 * This function adds event listeners to all input elements within the options containers. When an input element 
 * is changed (e.g., a radio button is selected), it calls the setIconInSettingsOptions function to update the 
 * active option icon based on the selected input.
 */
const optionsContainer: NodeListOf<Element> = document.querySelectorAll(".options-container")
optionsContainer.forEach((container) => {
    const inputContainer: NodeListOf<HTMLInputElement> = container.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
    if(!inputContainer) return;

    inputContainer.forEach((input) => {
        input.addEventListener("change", () => {
        setIconInSettingsOptions(container, input);
        storeSelectionInSettings(input);
        storeSettingsInLocalStorage(settings);               
        showSelectedOptionsInPreview();
        showPreviewImageBasedOnSelectedTheme();
        enableStartGameButtonIfAllOptionsSelected();                                
        });
    });
});



/**
 * This function takes an input element as a parameter and updates the settings object based on the name and dataset of 
 * the input element.
 * @param input The input element whose value is to be stored in the settings object.
 */
function storeSelectionInSettings(input: HTMLInputElement){
    const { name, dataset } = input;
    if(name === "theme"){
        settings.theme = dataset.theme as "Code vibes theme" | "Gaming theme";
    } else if(name === "player"){
        settings.player = dataset.player as "Blue" | "Orange";
    } else if(name === "boardSize"){
        settings.boardSize = dataset.boardSize as "16 cards" | "24 cards" | "36 cards";
    }
}


function storeSettingsInLocalStorage(settings: {
    theme: "Code vibes theme" | "Gaming theme" | null,
    player: "Blue" | "Orange" | null,
    boardSize: "16 cards" | "24 cards" | "36 cards" | null
}){
    localStorage.setItem("memory_game_settings", JSON.stringify(settings));
}


/**
 * This function updates the text content of the preview elements to show the currently selected options from the settings object.
 */
function showSelectedOptionsInPreview(){
    const selectedThemeRef: HTMLElement | null = document.getElementById("selected_theme");
    const selectedPlayerRef: HTMLElement | null = document.getElementById("selected_player");
    const selectedBoardSizeRef: HTMLElement | null = document.getElementById("selected_board_size");
    if(selectedThemeRef){
        selectedThemeRef.textContent = `${settings.theme}`;
    }
    if(selectedPlayerRef && settings.player !== null){
        selectedPlayerRef.textContent = `${settings.player}`;
    }
    if(selectedBoardSizeRef && settings.boardSize !== null){
        selectedBoardSizeRef.textContent = `${settings.boardSize}`;
    }
}


/**
 * This function shows the preview image based on the selected theme in the settings object.
 */
function showPreviewImageBasedOnSelectedTheme(){
    const theme1ImgRef: HTMLImageElement | null = document.getElementById("theme_1_img") as HTMLImageElement | null;
    const theme2ImgRef: HTMLImageElement | null = document.getElementById("theme_2_img") as HTMLImageElement | null;
    if(settings.theme === "Gaming theme"){
        if(theme1ImgRef && theme2ImgRef){
            theme1ImgRef.style.display = "block";
            theme2ImgRef.style.display = "none";
        }
    } else if(settings.theme === "Code vibes theme"){
        if(theme1ImgRef && theme2ImgRef){
            theme1ImgRef.style.display = "none";
            theme2ImgRef.style.display = "block";
        }
    }
}


/**
 * This function enables the start game button if all options (theme, player, and board size) are selected in the settings object.
 */
function enableStartGameButtonIfAllOptionsSelected(){
    const startGameBtnRef: HTMLButtonElement | null = document.getElementById("start_game_button") as HTMLButtonElement | null;
    if(settings.theme && settings.player && settings.boardSize){
        if(startGameBtnRef){
            startGameBtnRef.disabled = false;
        }
    } else {
        if(startGameBtnRef){
            startGameBtnRef.disabled = true;
        }
    }
}


/**
 * This function initializes the game by adding event listeners to the game field and buttons. It handles card flipping and 
 * showing/hiding the exit game dialog.
 */
document.addEventListener("DOMContentLoaded", () => {
  const fieldRef: HTMLElement | null = document.getElementById("field");
  if (!fieldRef) return;      // läuft dann nur auf Seiten mit Spielfeld
  new GameBoard();
});