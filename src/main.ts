import chalk from "chalk";
type Color = "white" | "black";
function myXOR(a: boolean, b: boolean) {
  return (a || b) && !(a && b);
}

export class Game {
  board: Piece[][];
  kings: King[];
  constructor() {
    this.kings = [];
    this.board = [];
    for (let r = 0; r < 8; r++) {
      this.board[r] = [];
      for (let f = 0; f < 8; f++) {
        this.board[r][f] = null;
      }
    }
  }
  tempMovePiece(fr: Place, to: Place): () => void {
    let save = this.get(to);
    this.set(to, this.get(fr));
    this.set(fr, null);
    return () => {
      this.tempMovePiece(to, fr);
      this.set(to, save);
    };
  }
  isChecked(color: "black" | "white") {
    return (
      this.kings.findIndex((k) => k.color === color && k.isInCheck()) != -1
    );
  }
  get(place: Place) {
    return this.board[place.rank][place.file];
  }
  set(place: Place, piece: Piece) {
    if (piece instanceof King) this.kings.push(piece);
    if (piece) piece.place = place;
    this.board[place.rank][place.file] = piece;
  }
  displayPiece(rank: number, file: number): string {
    let dark = myXOR(file % 2 == 0, rank % 2 == 0);
    const color = dark ? chalk.bgBlue : chalk.bgWhite;
    let toPrint = this.board[rank][file];
    if (toPrint != null) {
      return color(toPrint.toString() + " ");
    } else {
      return color("  ");
    }
  }
  display(showMovesFor?: Place) {
    let strs: string[][] = [];
    for (let r = 0; r < 8; r++) {
      strs[r] = [];
      for (let f = 0; f < 8; f++) {
        strs[r][f] = this.displayPiece(r, f);
      }
    }
    if (showMovesFor) {
      let moves = this.get(showMovesFor).validMoves();
      for (let { file, rank } of moves) {
        strs[rank][file] = chalk.dim(strs[rank][file]);
      }
    }
    for (let r = 0; r < 8; r++) {
      console.log(`${r}${strs[r].join("")}`);
    }
    console.log(" 0 1 2 3 4 5 6 7");
  }
}

class Place {
  rank: number;
  file: number;
  constructor(rank: number, file: number) {
    this.rank = rank;
    this.file = file;
  }
}

abstract class Piece {
  game: Game;
  color: Color;
  place: Place;
  constructor(color: Color, game: Game) {
    this.color = color;
    this.game = game;
  }
  abstract canMoveTo(): Place[];
  validMoves(): Place[] {
    return this.canMoveTo().filter((to) => {
      const undo = game.tempMovePiece(this.place, to);
      let flag = this.game.isChecked(this.color);
      undo();
      return !flag;
    });
  }
  calcMoves(
    move: {
      from: Place;
      increments: Place;
      repeat: number;
      count: number;
      type: "takesOnly" | "normal" | "noTakes";
    },
    places: Place[]
  ) {
    let { from, increments, repeat, count, type } = move;
    let to = {
      file: from.file + increments.file,
      rank: from.rank + increments.rank,
    };
    if (to.file < 0 || to.file > 7 || to.rank < 0 || to.rank > 7) {
      return;
    }
    let toPiece = this.game.get(to);
    if (toPiece === null) {
      if (count < repeat)
        this.calcMoves({ ...move, from: to, count: count + 1 }, places);
      if (type !== "takesOnly") places.push(to);
    } else if (toPiece.color !== this.color) {
      if (type !== "noTakes") places.push(to);
    }
  }
  calcManyMoves(
    incrementsList: Place[],
    repeat: number = 8,
    places: Place[] = []
  ) {
    for (let increments of incrementsList) {
      // this.calcMoves(this.place, increments, repeat, places)
      this.calcMoves(
        { from: this.place, increments, repeat, count: 0, type: "normal" },
        places
      );
    }
    return places;
  }
  calcManyMovesVerbose(
    moves: {
      increments: Place;
      repeat: number;
      type: "takesOnly" | "normal" | "noTakes";
    }[],
    places: Place[] = []
  ) {
    for (let move of moves) {
      // this.calcMoves(this.place, increments, repeat, places)
      this.calcMoves({ from: this.place, ...move, count: 0 }, places);
    }
    return places;
  }
  abstract strings: { black: string; white: string };
  toString() {
    return this.strings[this.color];
  }
}

class Pawn extends Piece {
  strings = { black: "♟", white: "♙" };
  direction = this.color === "black" ? 1 : -1;
  canMoveTo(): Place[] {
    let onStart =
      (this.color === "black" && this.place.rank === 1) ||
      (this.color === "white" && this.place.rank === 6);
    return this.calcManyMovesVerbose([
      {
        increments: { file: -1, rank: this.direction },
        repeat: 0,
        type: "takesOnly",
      },
      {
        increments: { file: 1, rank: this.direction },
        repeat: 0,
        type: "takesOnly",
      },
      {
        increments: { file: 0, rank: this.direction },
        repeat: onStart ? 1 : 0,
        type: "noTakes",
      },
    ]);
  }
}

const straigts = [
  { file: 1, rank: 0 },
  { file: -1, rank: 0 },
  { rank: 1, file: 0 },
  { rank: -1, file: 0 },
];
class Rook extends Piece {
  strings = { black: "♜", white: "♖" };
  canMoveTo(): Place[] {
    return this.calcManyMoves(straigts);
  }
}
const lmoves = [
  { file: 1, rank: 2 },
  { file: -1, rank: 2 },
  { file: -1, rank: -2 },
  { file: 1, rank: -2 },
  { file: 2, rank: 1 },
  { file: -2, rank: 1 },
  { file: -2, rank: -1 },
  { file: 2, rank: -1 },
];
class Knight extends Piece {
  strings = { black: "♞", white: "♘" };
  canMoveTo(): Place[] {
    return this.calcManyMoves(lmoves, 1);
  }
}
const diagonals = [
  { file: 1, rank: 1 },
  { file: -1, rank: 1 },
  { file: -1, rank: -1 },
  { file: 1, rank: -1 },
];
class Bishop extends Piece {
  strings = { black: "♝", white: "♗" };
  canMoveTo(): Place[] {
    return this.calcManyMoves(diagonals);
  }
}

class Queen extends Piece {
  strings = { black: "♚", white: "♔" };
  canMoveTo(): Place[] {
    return this.calcManyMoves([...diagonals, ...straigts]);
  }
}

class King extends Piece {
  strings = { black: "♛", white: "♕" };
  canMoveTo(): Place[] {
    return this.calcManyMoves([...diagonals, ...straigts], 0);
  }
  isInCheck() {
    const test = (
      incrementsList: Place[],
      repeat: number,
      predicate: (piece: Piece) => boolean
    ) => {
      return (
        this.calcManyMovesVerbose(
          incrementsList.map((m) => ({
            increments: m,
            repeat,
            type: "takesOnly",
          }))
        ).findIndex((place) => {
          const piece = this.game.get(place);
          return predicate(piece) && this.color != piece.color;
        }) != -1
      );
    };
    return (
      test(lmoves, 0, (p) => p instanceof Knight) ||
      test(straigts, 8, (p) => p instanceof Queen || p instanceof Rook) ||
      test(diagonals, 8, (p) => p instanceof Queen || p instanceof Bishop) ||
      test([...diagonals, ...straigts], 0, (p) => p instanceof King) ||
      test(diagonals, 0, (p) => {
        if (p instanceof Pawn) {
          return p.direction === Math.sign(this.place.rank - p.place.rank);
        }
        return false;
      })
    );
  }
}

let game = new Game();
game.display();
let king = new Rook("white", game);
let knight = new Knight("white", game);
let rook = new Rook("black", game);
let rook2 = new King("black", game);
// game.set({ file: 7, rank: 2 }, rook);
game.set({ file: 1, rank: 7 }, king);
game.set({ file: 1, rank: 5 }, rook);
// game.set({ file: 2, rank: 1 }, knight);
game.set({ file: 1, rank: 2 }, rook2);
game.display({ file: 1, rank: 5 });

// console.log(game.board[4][4].canMoveTo())
