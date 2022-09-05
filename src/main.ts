import chalk from "chalk";
type Color = "white" | "black";
function myXOR(a: boolean, b: boolean) {
  return (a || b) && !(a && b);
}

export class Game {
  board: Piece[][];
  king?: Piece;
  constructor() {
    this.board = [
      [
        new Rook("black", this),
        new Knight("black", this),
        new Bishop("black", this),
        new Queen("black", this),
        new King("black", this),
        new Bishop("black", this),
        new Knight("black", this),
        new Rook("black", this),
      ],
      [
        new Pawn("black", this),
        new Pawn("black", this),
        new Pawn("black", this),
        new Pawn("black", this),
        new Pawn("black", this),
        new Pawn("black", this),
        null,
        new Pawn("black", this),
      ],
      [
        new King("white", this),
        null,
        null,
        null,
        null,
        new Rook("white", this),
        new Pawn("black", this),
        null,
      ],
      [
        null,
        null,
        new Knight("white", this),
        null,
        null,
        new Queen("black", this),
        null,
        null,
      ],
      [
        null,
        null,
        null,
        new Bishop("black", this),
        new Rook("white", this),
        null,
        null,
        null,
      ],
      [null, null, null, null, null, null, null, null],
      [
        new Pawn("white", this),
        new Pawn("white", this),
        new Pawn("white", this),
        new Pawn("white", this),
        new Pawn("white", this),
        new Pawn("white", this),
        new Pawn("white", this),
        new Pawn("white", this),
      ],
      [
        new Rook("white", this),
        new Knight("white", this),
        new Bishop("white", this),
        new Queen("white", this),
        new King("white", this),
        new Bishop("white", this),
        new Knight("white", this),
        new Rook("white", this),
      ],
    ];

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        let toEdit = this.board[r][f];
        if (toEdit != null) {
          toEdit.place = new Place(r, f);
        }
      }
    }
  }
  get(place: Place) {
    return this.board[place.rank][place.file];
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
      let moves = this.get(showMovesFor).canMoveTo();
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
  calcMoves(
    move: {
      from: Place;
      increments: Place;
      repeat: number;
      count: number;
      onlyForTake: boolean;
    },
    places: Place[]
  ) {
    let { from, increments, repeat, count, onlyForTake } = move;
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
      if (!onlyForTake) places.push(to);
    } else if (toPiece.color !== this.color) {
      places.push(to);
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
        { from: this.place, increments, repeat, count: 0, onlyForTake: false },
        places
      );
    }
    return places;
  }
  calcManyMovesVerbose(
    moves: { increments: Place; repeat: number; onlyForTake: boolean }[],
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
  canMoveTo(): Place[] {
    let direction = this.color === "black" ? 1 : -1;
    let onStart =
      (this.color === "black" && this.place.rank === 1) ||
      (this.color === "white" && this.place.rank === 6);
    return this.calcManyMovesVerbose([
      {
        increments: { file: -1, rank: direction },
        repeat: 0,
        onlyForTake: true,
      },
      {
        increments: { file: 1, rank: direction },
        repeat: 0,
        onlyForTake: true,
      },
      {
        increments: { file: 0, rank: direction },
        repeat: onStart ? 1 : 0,
        onlyForTake: false,
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

class Knight extends Piece {
  strings = { black: "♞", white: "♘" };
  canMoveTo(): Place[] {
    return this.calcManyMoves(
      [
        { file: 1, rank: 2 },
        { file: -1, rank: 2 },
        { file: -1, rank: -2 },
        { file: 1, rank: -2 },
        { file: 2, rank: 1 },
        { file: -2, rank: 1 },
        { file: -2, rank: -1 },
        { file: 2, rank: -1 },
      ],
      1
    );
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
}

let game = new Game();
game.display({ rank: 4, file: 4 });
game.display({ rank: 4, file: 3 });
game.display({ rank: 3, file: 2 });
game.display({ rank: 3, file: 5 });
game.display({ rank: 2, file: 0 });
game.display({ rank: 2, file: 6 });
game.display({ rank: 6, file: 6 });
// console.log(game.board[4][4].canMoveTo())
