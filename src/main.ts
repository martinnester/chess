type Color = "white" | "black";

class Game {

}

class Place {
    rank: number;
    file: number;
}

abstract class Piece {
    game : Game;
    color : Color
    constructor(color: Color, game: Game) {
        this.color = color
        this.game = game
    }
    abstract canMoveTo() : Place[];
    move(to: Place): boolean {
        return this.canMoveTo().indexOf(to)!=-1;
    }
}

class Rook extends Piece {
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }
    move(to: Place): void {
        
    }
}

class Knight extends Piece {

}

class Bishop extends Piece {

}

class Queen extends Piece {

}

class King extends Piece {

}