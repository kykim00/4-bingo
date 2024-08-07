function calculateMovesProbabilities(board, remainingMoves) {
  function isWinningBoard(board) {
    for (let i = 0; i < 5; i++) {
      if (board[i].every(num => num === 0) || board.every(row => row[i] === 0)) {
        return true;
      }
    }
    return board.every((row, i) => row[i] === 0) || board.every((row, i) => row[4-i] === 0);
  }

  function countBingos(board) {
    let bingoCount = 0;
    for (let i = 0; i < 5; i++) {
      if (board[i].every(num => num === 0)) bingoCount++;
      if (board.every(row => row[i] === 0)) bingoCount++;
    }
    if (board.every((row, i) => row[i] === 0)) bingoCount++;
    if (board.every((row, i) => row[4-i] === 0)) bingoCount++;
    return bingoCount;
  }

  function simulateGame(board, moves, playerChoice) {
    let newBoard = board.map(row => [...row]);
    let availableNumbers = newBoard.flat().filter(num => num !== 0);

    // Player's move
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (newBoard[i][j] === playerChoice) {
          newBoard[i][j] = 0;
          i = 5; // Break outer loop
          break;
        }
      }
    }

    // System's move
    if (availableNumbers.length > 0) {
      let systemChoice = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (newBoard[i][j] === systemChoice) {
            newBoard[i][j] = 0;
            i = 5; // Break outer loop
            break;
          }
        }
      }
    }

    if (isWinningBoard(newBoard) || moves <= 1) {
      return countBingos(newBoard) >= 4 ? 1 : 0;
    }

    let winProbability = 0;
    availableNumbers = newBoard.flat().filter(num => num !== 0);
    for (let nextChoice of availableNumbers) {
      winProbability += simulateGame(newBoard, moves - 1, nextChoice);
    }

    return winProbability / availableNumbers.length;
  }

  let availableNumbers = board.flat().filter(num => num !== 0);
  let probabilities = {};

  for (let choice of availableNumbers) {
    let probability = simulateGame(board, remainingMoves, choice);
    probabilities[choice] = probability;
  }

  return probabilities;
}

let board = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 0, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25]
];

let moveProbabilities = calculateMovesProbabilities(board, 7); // 7 remaining moves (8 total - 1 already made)
console.log("Probabilities for each move:");
for (let [move, probability] of Object.entries(moveProbabilities)) {
  console.log(`Move ${move}: ${probability.toFixed(4)}`);
}