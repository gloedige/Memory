export class GameCard {

    id: number;
    name?: string;
    imagePath: string;
    isFlipped: boolean = false;
    isMatched: boolean = false;

    constructor(id: number, imagePath: string, name?: string){
        this.id = id;
        this.imagePath = imagePath;
        if(name){
            this.name = name;
        }
    }


    changeFlipStatus(): void {
        this.isFlipped = !this.isFlipped;
    }


    match(otherCard: GameCard): boolean {
        if(this.id === otherCard.id){
            this.isMatched = true;
            otherCard.isMatched = true;
            return true;
        }
        return false;
    }
    
}