type Color = "white" | "black";

class Game {
    board: Piece[][]
    king?: Piece
    constructor(){
       this.board = [[new Rook("black",this)]] 
    }
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
}

class Rook extends Piece {
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }
}

class Knight extends Piece {
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }

}

class Bishop extends Piece {
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }

}

class Queen extends Piece {
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }

}

class King extends Piece {
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }

}