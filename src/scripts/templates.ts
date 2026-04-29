export function renderSingleCardsToGameBoard(imagePath: string): string {
    return  `
            <button class="card">
                <div class="card__inner">
                    <div class="card__face card__face--front">
                        <img src="../assets/images/code_vibes_theme/code_vibes_card_back.svg" alt="card back image">
                    </div>
                    <div class="card__face card__face--back">
                        <img src="${imagePath}" alt="card front image">
                    </div>
                </div>
            </button>
            `
    
}