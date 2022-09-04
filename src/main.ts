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
    
        for(let r = 0; r<8; r++){
            for(let f =0; r<8; f++){
                this.board[r][f].place = {rank:r, file:r};
            }
        }
    }
}

class Place {
    rank: number;
    file: number;
}


abstract class Piece {
    game : Game;
    color : Color
    place : Place
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
        let places : Place[] = []
        const calcMoves = (places:Place[], r:number)=>{
            if(this.game.board[this.place.rank][this.place.file].color==this.color){
                return false;
            }
            let place = {rank:r, file: this.place.file};
            places.push(place);
            if(this.game.board[place.rank][place.file]!=null){
                return false;
            }
            return true;
        }

        for(let r=this.place.rank+1; r<8; r++){
            if(calcMoves(places, r)==false) break;
        }
        for(let r=this.place.rank-1; r>=0; r--){
            if(calcMoves(places, r)==false) break;
        }
        
        return places;
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