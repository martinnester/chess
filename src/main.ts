const chalk = require("chalk")
type Color = "white" | "black";
function myXOR(a:boolean,b:boolean) {
    return ( a || b ) && !( a && b );
  }

export class Game {
    board: Piece[][]
    king?: Piece
    constructor(){
       this.board = 
       [[new Rook("black", this),new Knight("black", this),new Bishop("black", this),new Queen("black", this),new King("black", this),new Bishop("black", this),new Knight("black", this),new Rook("black", this)],
       [new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this),new Pawn("black", this)],
       [null,null,null,null,null,null,null,null],
       [null,null,null,null,null,null,null,null],
       [null,null,null,new Bishop("black", this),new Rook("white", this),null,null,null],
       [null,null,null,null,null,null,null,null],
       [new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this),new Pawn("white", this)],
       [new Rook("white", this),new Knight("white", this),new Bishop("white", this),new Queen("white", this),new King("white", this),new Bishop("white", this),new Knight("white", this),new Rook("white", this)],] 
    
        for(let r = 0; r<8; r++){
            for(let f =0; f<8; f++){
                let toEdit= this.board[r][f];
                if(toEdit!=null){
                    toEdit.place = new Place(r,f);
                }
            }
        }
    }
    get(place:Place){
        return this.board[place.rank][place.file];
    }
    displayPiece(rank:number, file:number): string{
        let dark = myXOR(file%2==0,rank%2==0);
        const color = dark ? chalk.bgBlue : chalk.bgWhite;
        let toPrint= this.board[rank][file];
        if(toPrint!=null){
            return color(toPrint.toString()+" ")
        } else{
            return color("  ");
        }
    }
    display(showMovesFor?:Place){
        let strs: string[][] = [];
        for(let r = 0; r<8; r++){
            strs[r] = []
            for(let f =0; f<8; f++){
                strs[r][f]= this.displayPiece(r,f);
            }
        }
        if(showMovesFor){
            let moves = this.get(showMovesFor).canMoveTo();
            for(let {file,rank} of moves){
                strs[rank][file] = chalk.dim(strs[rank][file]);
            }
        }
        for(let r = 0; r<8; r++){
            console.log(`${r}${strs[r].join("")}`)
        }
        console.log(" 0 1 2 3 4 5 6 7")
    }
    
}

class Place {
    rank: number;
    file: number;
    constructor(rank:number,file:number){
        this.rank=rank;
        this.file=file;
    }
}

type Next = (place:Place)=> Place;

abstract class Piece {
    game : Game;
    color : Color
    place : Place
    constructor(color: Color, game: Game) {
        this.color = color
        this.game = game
    }
    abstract canMoveTo() : Place[];
    calcMoves(from:Place,increments:Place, repeat: boolean, places: Place[]){

        let to = {file: from.file+increments.file, rank: from.rank+increments.rank};
        if(to.file<0 || to.file>7 ||to.rank<0 || to.rank>7){
            return;
        }
        let toPiece = this.game.get(to);
        if(toPiece===null){
        
            if(repeat)this.calcMoves(to,increments, repeat, places );
            places.push(to);
        }else if(toPiece.color===this.color){
            //do nothing
        } else if(toPiece.color!==this.color){
            places.push(to);
        }
    }
    calcManyMoves(incrementsList: Place[], repeat: boolean, places: Place[] = []){
        for(let increments of incrementsList){
            this.calcMoves(this.place,increments,repeat,places)
        }
        return places;
    }
    abstract strings:{black:string, white:string}
    toString(){
        return this.strings[this.color];
    }
}


class Pawn extends Piece {
    strings={black:"♟",white:"♙"};
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }
}


class Rook extends Piece {
    strings= { black: "♜", white: "♖" };
    canMoveTo(): Place[] {
        return this.calcManyMoves([{file:1, rank:0},{file:-1, rank:0},{rank:1, file:0},{rank:-1, file:0}],true);
    }
}

class Knight extends Piece {
    strings= { black: "♞", white: "♘" };
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }

}

class Bishop extends Piece {
    strings= { black: "♝", white: "♗" };
    canMoveTo(): Place[] {
        return this.calcManyMoves([{file:1, rank:1},{file:-1, rank:1},{file:-1, rank:-1},{file:1, rank:-1}],true);;
    }

}

class Queen extends Piece {
    strings= { black: "♚", white: "♔" };
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }

}

class King extends Piece {
    strings= { black: "♛", white: "♕" };
    canMoveTo(): Place[] {
        throw new Error("Method not implemented.");
    }

}


let game = new Game();
game.display({rank:4, file:4});
game.display({rank:4, file:3});
// console.log(game.board[4][4].canMoveTo())
