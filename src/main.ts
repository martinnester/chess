type PType = "R" | "N" | "B" | "Q" | "K" | "P";
type PColor = "W" | "B";
type Piece = `${PColor}${PType}` | "XX"

function forN(n: number, callback: (ind:number)=>void ){
  for(let i =0; i<n;i++){
    callback(i)
  }
}

class Game {
    static initialBoard: Piece[][] = 
    [["BR","BN","BB","BQ","BK","BB","BN","BR"],
     ["BP","BP","BP","BP","BP","BP","BP","BP"],
     ["XX","XX","XX","XX","XX","XX","XX","XX"],
     ["XX","XX","XX","XX","XX","XX","XX","XX"],
     ["XX","XX","XX","XX","XX","XX","XX","XX"],
     ["XX","XX","XX","XX","XX","XX","XX","XX"],
     ["WP","WP","WP","WP","WP","WP","WP","WP"],
     ["WR","WN","WB","WQ","WK","WB","WN","WR"],]
    board : Piece[][]; // [rank][file]  rank=horizontal file=vertical
    kingPos: {r:number,f:number};
    Game(){
        this.board = Game.initialBoard;
        this.kingPos = {r:0,f:4};
    }

    move(r1:number,f1:number,r2:number,f2:number):boolean {

        this.board[r2][f2] = this.board[r1][f1]
        this.board[r1][f1] = "XX"
        return true;
    }
}