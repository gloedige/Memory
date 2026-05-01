export function renderSingleCardsToGameBoard(imagePath: string, cardBackPath: string): string {
    return  `
            <button class="card">
                <div class="card__inner">
                    <div class="card__face card__face--front">
                        <img 
                            src="${cardBackPath}"
                            alt="card back image">
                    </div>
                    <div class="card__face card__face--back">
                        <img src="${imagePath}" alt="card front image">
                    </div>
                </div>
            </button>
            `
    
}