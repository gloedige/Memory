/**
 * This function adds event listeners to all input elements within the options containers. When an input element 
 * is changed (e.g., a radio button is selected), it calls the setIconInSettingsOptions function to update the 
 * active option icon based on the selected input.
 */
export function addEventListenersToSettingsOptions(settings: {
    theme: "Code vibes theme" | "Gaming theme" | null,
    player: "Blue" | "Orange" | null,
    boardSize: "16 cards" | "24 cards" | "36 cards" | null
}){
    const optionsContainers: NodeListOf<Element> = document.querySelectorAll(".options-container");
    optionsContainers.forEach((container) => {
        const options: NodeListOf<Element> = container.querySelectorAll(".options-container__element");
        if(!options.length) return;
        options.forEach((option) => {
            const input: HTMLInputElement | null = option.querySelector("input");
            addMouseEnterEventListenersToSettingsOptions(option, input, container, settings);
            addClickEventListenersToSettingsOptions(option, input, container, settings);
        });
    });
}


/**
 * This function sets the color of the winner's name and icon based on who won the game. It checks the name of the winning player and calls the 
 * appropriate function to set the color of the winner's name and icon for either the blue player, orange player, or a tie.
 * @param winner The name of the winning player.
 * @param theme The selected theme of the game, which may affect the styling of the winner's name and icon.
 * @param option The option element that was hovered.
 * @param input The input element associated with the hovered option.
 * @param container The container element that holds the options.
 */
function addMouseEnterEventListenersToSettingsOptions(option: Element, input: HTMLInputElement | null, container: Element, settings: {
    theme: "Code vibes theme" | "Gaming theme" | null,
    player: "Blue" | "Orange" | null,
    boardSize: "16 cards" | "24 cards" | "36 cards" | null
}){
     option.addEventListener("mouseenter", () => {
                handleImagePreviewOnHover(input, container, settings.theme);
            });
}


/**
 * This function handles the change event for the settings options. It updates the active option icon, stores the selected option in the settings 
 * object, and performs other related actions.
 * @param option The option element that was clicked.
 * @param input The input element associated with the option.
 * @param container The container element that holds the options.
 */
export function addClickEventListenersToSettingsOptions(option: Element, input: HTMLInputElement | null, container: Element, settings: {
    theme: "Code vibes theme" | "Gaming theme" | null,
    player: "Blue" | "Orange" | null,
    boardSize: "16 cards" | "24 cards" | "36 cards" | null
}){
    option.addEventListener("click", () => {
                if (!input) return;
                input.checked = true;
                setIconInSettingsOptions(container, input);
                storeSelectionInSettings(input, settings);
                storeSettingsInLocalStorage(settings);
                showSelectedOptionsInPreview(settings);
                showPreviewImageBasedOnSelectedTheme(settings.theme);
                enableStartGameButtonIfAllOptionsSelected(settings);
            });
}


/**
 * This function handles the hover event on the settings options to show a preview image based on the theme associated with the hovered option.
 * @param input The input element associated with the hovered option.
 * @param container The container element within which the options are located.
 */
function handleImagePreviewOnHover(input: HTMLInputElement | null, container: Element, theme: "Code vibes theme" | "Gaming theme" | null = null){
    if (theme) return;
    const hoveredTheme: "Code vibes theme" | "Gaming theme" | null =
        input?.dataset.theme === "Gaming theme"
            ? "Gaming theme"
            : input?.dataset.theme === "Code vibes theme"
                ? "Code vibes theme"
                : null;
    if (!hoveredTheme) return;
    setPreviewImageByTheme(hoveredTheme);
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
 * This function takes an input element as a parameter and updates the settings object based on the name and dataset of 
 * the input element.
 * @param input The input element whose value is to be stored in the settings object.
 */
function storeSelectionInSettings(input: HTMLInputElement, settings: {
    theme: "Code vibes theme" | "Gaming theme" | null,
    player: "Blue" | "Orange" | null,
    boardSize: "16 cards" | "24 cards" | "36 cards" | null
}){
    const { name, dataset } = input;
    if(name === "theme"){
        settings.theme = dataset.theme as "Code vibes theme" | "Gaming theme";
    } else if(name === "player"){
        settings.player = dataset.player as "Blue" | "Orange";
    } else if(name === "boardSize"){
        settings.boardSize = dataset.boardSize as "16 cards" | "24 cards" | "36 cards";
    }
}


/**
 * This function takes a settings object as a parameter and stores it in local storage under the key "memory_game_settings" after converting 
 * it to a JSON string.
 * @param settings The settings object to be stored in local storage.
 */
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
function showSelectedOptionsInPreview(settings: {
    theme: "Code vibes theme" | "Gaming theme" | null,
    player: "Blue" | "Orange" | null,
    boardSize: "16 cards" | "24 cards" | "36 cards" | null
}){
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
function showPreviewImageBasedOnSelectedTheme(theme: "Code vibes theme" | "Gaming theme" | null = null){
    setPreviewImageByTheme(theme);
}


/**
 * This function updates the preview image visibility based on the given theme.
 * @param theme The selected or hovered theme.
 */
function setPreviewImageByTheme(theme: "Code vibes theme" | "Gaming theme" | null): void {
    const theme1ImgRef: HTMLImageElement | null = document.getElementById("theme_1_img") as HTMLImageElement | null;
    const theme2ImgRef: HTMLImageElement | null = document.getElementById("theme_2_img") as HTMLImageElement | null;
    if(theme === "Gaming theme"){
        if(theme1ImgRef && theme2ImgRef){
            theme1ImgRef.style.display = "block";
            theme2ImgRef.style.display = "none";
        }
    } else if(theme === "Code vibes theme"){
        if(theme1ImgRef && theme2ImgRef){
            theme1ImgRef.style.display = "none";
            theme2ImgRef.style.display = "block";
        }
    }
}


/**
 * This function enables the start game button if all options (theme, player, and board size) are selected in the settings object.
 */
function enableStartGameButtonIfAllOptionsSelected(settings: {
    theme: "Code vibes theme" | "Gaming theme" | null,
    player: "Blue" | "Orange" | null,
    boardSize: "16 cards" | "24 cards" | "36 cards" | null
}){
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