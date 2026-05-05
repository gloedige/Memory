import { resolveAssetPath } from "./asset_paths";

type ThemeType = "Code vibes theme" | "Gaming theme" | null;

/**
 * This function sets the color of the winner's name and icon in the winner page based on who won the game.
 * @param winner The name of the winning player.
 * @returns void
 */
export function handleColorOfWinnerNameAndIcon(winner: string, theme: ThemeType){
    const winnerNameRef: HTMLElement | null = document.getElementById("winner_name");
    const winnerIconRef: HTMLElement | null = document.getElementById("winner_icon");
    if(winner === "Blue Player"){
        setColorOfWinnerNameAndIcon(winnerIconRef, winnerNameRef, winner, theme);
    } else if(winner === "Orange Player"){
        setColorOfWinnerNameAndIcon(winnerIconRef, winnerNameRef, winner, theme);
    } else if (winner === "No one, it's a tie"){
        setColorOfWinnerNameAndIconForTie(winnerIconRef, winnerNameRef, winner, theme);
    }
}


/**
 * This function sets the color of the winner's name and icon for the blue player by adding the appropriate CSS classes.
 * @param winnerIconRef The HTML element representing the winner's icon.
 * @param winnerNameRef The HTML element representing the winner's name.
 * @param winner The name of the winning player.
 */
function setColorOfWinnerNameAndIcon(winnerIconRef: HTMLElement | null, winnerNameRef: HTMLElement | null, winner: string, theme: ThemeType){
    const lowercaseWinnerIdentifier = winner.toLowerCase().replace(" player", "");
    const oppositeWinnerIdentifier = lowercaseWinnerIdentifier === "blue" ? "orange" : "blue";
    if(winnerNameRef){
        winnerNameRef.classList.add(`winner-container__winner-name--winner-${lowercaseWinnerIdentifier}`);
        winnerNameRef.classList.remove(`winner-container__winner-name--winner-${oppositeWinnerIdentifier}`);
    }
    if(winnerIconRef){
        setWinnerImageSourceBasedOnWinner(winnerIconRef, winner, theme);
    }
}


/**
 * This function sets the color of the winner's name and icon for a tie by adding the appropriate CSS class for a tie and removing any classes for 
 * specific winners.
 * @param winnerIconRef The HTML element representing the winner's icon.
 * @param winnerNameRef The HTML element representing the winner's name.
 * @param winner The name of the winning player.
 */
function setColorOfWinnerNameAndIconForTie(winnerIconRef: HTMLElement | null, winnerNameRef: HTMLElement | null, winner: string, theme: ThemeType){
    if(winner === "No one, it's a tie"){
        winnerNameRef?.classList.add("winner-container__winner-name--winner-tie");
        winnerNameRef?.classList.remove(`winner-container__winner-name--winner-blue`);
        winnerNameRef?.classList.remove(`winner-container__winner-name--winner-orange`);
    } else {
        winnerNameRef?.classList.remove("winner-container__winner-name--winner-tie");
    }
    if(winnerIconRef){
        setWinnerImageSourceBasedOnWinner(winnerIconRef, winner, theme);
    }
}


/**
 * This function sets the image source of the winner's icon based on the selected theme and the winning player.
 * @param winnerIconRef The HTML element representing the winner's icon.
 * @param winner The name of the winning player.
 */
function setWinnerImageSourceBasedOnWinner(winnerIconRef: HTMLElement, winner: string, theme: ThemeType){
    if (winner === "No one, it's a tie"){
        setWinnerIconVisibility(winnerIconRef, false);
        (winnerIconRef as HTMLImageElement).removeAttribute("src");
        return;
    }

    setWinnerIconVisibility(winnerIconRef, true);
    if (theme === "Gaming theme"){
        const gamingWinnerIconSrc: string | undefined = winnerIconRef.dataset.iconGaming;
        if(gamingWinnerIconSrc){
            (winnerIconRef as HTMLImageElement).src = resolveAssetPath(gamingWinnerIconSrc);
        }
    } else if (theme === "Code vibes theme"){
         setWinnerImageSourceBasedOnWinnerForCodeVibesTheme(winnerIconRef, winner);
    }
}


/**
 * This function sets the image source of the winner's icon for the Code Vibes theme based on the winning player by retrieving the appropriate image source 
 * from the data attributes of the winner icon element and updating the src attribute of the image element accordingly.
 * @param winnerIconRef The HTML element representing the winner's icon.
 * @param winner The name of the winning player.
 */
function setWinnerImageSourceBasedOnWinnerForCodeVibesTheme(winnerIconRef: HTMLElement, winner: string){
    if (winner === "Blue Player"){
        const blueWinnerIconSrc: string | undefined = winnerIconRef.dataset.iconCodeVibesBlue || winnerIconRef.dataset.iconGaming;
        if(blueWinnerIconSrc){
            (winnerIconRef as HTMLImageElement).src = resolveAssetPath(blueWinnerIconSrc);
        } 
    } else if (winner === "Orange Player"){
        const orangeWinnerIconSrc: string | undefined = winnerIconRef.dataset.iconCodeVibesOrange || winnerIconRef.dataset.iconGaming;
        if(orangeWinnerIconSrc){
            (winnerIconRef as HTMLImageElement).src = resolveAssetPath(orangeWinnerIconSrc);
        }
    }
}


/**
 * This function sets the visibility of the winner icon based on whether there is a winner or a tie. If there is a tie, the icon is hidden; otherwise, it is shown.
 * @param winnerIconRef The HTML element representing the winner's icon.
 * @param isVisible A boolean indicating whether the winner icon should be visible.
 */
function setWinnerIconVisibility(winnerIconRef: HTMLElement, isVisible: boolean){
    const winnerIconContainerRef: HTMLElement | null = winnerIconRef.closest(".winner-container__winner-svg") as HTMLElement | null;
    if(winnerIconContainerRef){
        winnerIconContainerRef.style.display = isVisible ? "block" : "none";
    }
}