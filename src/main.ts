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