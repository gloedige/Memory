export class GameCard {

    id: number;
    name?: string;
    imagePath: string;
    isFlipped: boolean = false;
    isMatched: boolean = false;


    /**
     * This function initializes a new instance of the GameCard class. It takes an id, an image path and 
     * an optional name as parameters and assigns them to the corresponding properties of the class.
     * @param id The unique identifier for the card.
     * @param imagePath The path to the image displayed on the card.
     * @param name An optional name for the card.
     */
    constructor(id: number, imagePath: string, name?: string){
        this.id = id;
        this.imagePath = imagePath;
        if(name){
            this.name = name;
        }
    }

    /**
     * This function changes the flip status of the card. If the card is currently flipped, 
     * it will be flipped back and vice versa.
     */
    changeFlipStatus(): void {
        this.isFlipped = !this.isFlipped;
    }
    
}