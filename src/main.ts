import './styles/style.scss'

const exitBtn = document.getElementById("exit_game_button")
const backToGameBtn = document.getElementById("back_to_game")

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
        // console.log('image Element: ', optionsContainer);
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
    // const imgRef = optionsContainer?.querySelector("img") as HTMLImageElement | null;
    return optionsContainerElement as HTMLElement | null;
}


/**
 * This function adds event listeners to all input elements within the options containers. When an input element 
 * is changed (e.g., a radio button is selected), it calls the setIconInSettingsOptions function to update the 
 * active option icon based on the selected input.
 */
const optionsContainer = document.querySelectorAll(".options-container")
optionsContainer.forEach((container) => {
    const inputContainer = container.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
    if(!inputContainer) return;

    inputContainer.forEach((input) => {
        input.addEventListener("change", () => {
        console.log('input checked: ', input.checked);
        setIconInSettingsOptions(container, input);
        });
    });
});