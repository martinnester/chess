type Color = "white" | "black";

class Game {
    board: Piece[][]
    king?: Piece
    constructor(){
       this.board = 
       [[new Rook("black", this),new Knight("black", this),new Bishop("black", this),new Queen("black", this),new King("black", this),new Bishop("black", this),new Knight("black", this),new Rook("black", this)],
       [new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this)],
       [null,null,null,null,null,null,null,null],
       [null,null,null,null,null,null,null,null],
       [null,null,null,null,null,null,null,null],
       [null,null,null,null,null,null,null,null],
       [new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this)],
       [new Rook("white", this),new Knight("white", this),new Bishop("white", this),new Queen("white", this),new King("white", this),new Bishop("white", this),new Knight("white", this),new Rook("white", this)],] 
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


class Pawn extends Piece {
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }
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