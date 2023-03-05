const player = (name, marker) => {
  let isComputer = false;
  let score = 0;
  return { name, marker, isComputer, score };
};

const computer = (name, marker) => {
  const { score } = player(name, marker);
  const isComputer = true;

  const minimax = (board, playerMarker) => {
    const availableSpots = board.emptyIndices();

    let humanMarker;
    if (marker === 'X') {
      humanMarker = 'O';
    } else {
      humanMarker = 'X';
    }

    if (board.hasMetWinningCondition(humanMarker)) {
      return { score: -10 };
    } else if (board.hasMetWinningCondition(marker)) {
      return { score: 10 };
    } else if (availableSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      let move = {};
      move.index = availableSpots[i];
      board.updateBoard(availableSpots[i], playerMarker);

      if (playerMarker === marker) {
        let result = minimax(board, humanMarker);
        move.score = result.score;
      } else {
        let result = minimax(board, marker);
        move.score = result.score;
      }

      board.updateBoard(availableSpots[i], '');
      moves.push(move);
    }

    let bestMove;
    if (playerMarker === marker) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
    }
    return moves[bestMove];
  };

  return { name, marker, score, isComputer, minimax };
};

const gameBoard = () => {
  const board = ['', '', '', '', '', '', '', '', ''];
  const updateBoard = (index, marker) => {
    board[index] = marker;
  };

  const getCellMarker = (index) => board[index];

  const emptyBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  const emptyIndices = () => {
    const empty = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        empty.push(i);
      }
    }
    return empty;
  };

  function hasMetWinningCondition(marker) {
    const WINNING_CONDITIONS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return WINNING_CONDITIONS.some((condition) =>
      condition.every((index) => board[index] === marker)
    );
  }

  return {
    board,
    updateBoard,
    getCellMarker,
    emptyBoard,
    emptyIndices,
    hasMetWinningCondition
  };
};

const game = (playerOne, playerTwo) => {
  const board = gameBoard();
  let isPlayerOnesTurn = true;
  let firsttMove = true;
  const playerOneMarker = playerOne.marker;
  const playerTwoMarker = playerTwo.marker;
  const cells = document.querySelectorAll('.cell');
  const restartIcons = document.querySelectorAll('.restart-icon');

  function isDraw() {
    return board.board.every((cell) => cell === 'O' || cell === 'X');
  }

  function populateCell(e) {
    const xImg = './img/icon-x.svg';
    const circleImg = './img/icon-circle.svg';
    const index = e.target.getAttribute('data-key');
    if (isPlayerOnesTurn && playerOneMarker === 'O' && board.getCellMarker(index) === '') {
      const img = document.createElement('img');
      img.src = circleImg;
      e.target.appendChild(img);
      isPlayerOnesTurn = false;
      board.updateBoard(index, 'O');
      if (firsttMove) {
        firsttMove = false;
        const info = document.querySelector('.info');
        info.classList.add('disappear');
      }

      if (board.hasMetWinningCondition(playerOneMarker)) {
        restartGame(playerOne, playerTwo);
      } else if (isDraw()) {
        restartDraw();
      }

      if (playerTwo.isComputer) {
        const computerMove = playerTwo.minimax(board, playerTwoMarker);
        const cell = document.querySelector(`div[data-key="${computerMove.index}"]`);
        setTimeout(() => {
          if (cell !== null) {
            cell.click();
          }
        }, 300);
      }
    } else if (isPlayerOnesTurn && playerOneMarker === 'X' && board.getCellMarker(index) === '') {
      const img = document.createElement('img');
      img.src = xImg;
      e.target.appendChild(img);
      isPlayerOnesTurn = false;
      board.updateBoard(index, 'X');
      if (firsttMove) {
        firsttMove = false;
        const info = document.querySelector('.info');
        info.classList.add('disappear');
      }

      if (board.hasMetWinningCondition(playerOneMarker)) {
        restartGame(playerOne, playerTwo);
      } else if (isDraw()) {
        restartDraw();
      }

      if (playerTwo.isComputer) {
        const computerMove = playerTwo.minimax(board, playerTwoMarker);
        const cell = document.querySelector(`div[data-key="${computerMove.index}"]`);
        setTimeout(() => {
          if (cell !== null) {
            cell.click();
          }
        }, 300);
      }
    } else if (playerTwoMarker === 'O' && board.getCellMarker(index) === '') {
      const img = document.createElement('img');
      img.src = circleImg;
      e.target.appendChild(img);
      isPlayerOnesTurn = true;
      board.updateBoard(index, 'O');

      if (board.hasMetWinningCondition(playerTwoMarker)) {
        restartGame(playerTwo, playerOne);
      } else if (isDraw()) {
        restartDraw();
      }
    } else if (playerTwoMarker === 'X' && board.getCellMarker(index) === '') {
      const img = document.createElement('img');
      img.src = xImg;
      e.target.appendChild(img);
      isPlayerOnesTurn = true;
      board.updateBoard(index, 'X');
      
      if (board.hasMetWinningCondition(playerTwoMarker)) {
        restartGame(playerTwo, playerOne);
      } else if (isDraw()) {
        restartDraw();
      }
    }
  }

  function disableAllCells() {
    cells.forEach((cell) => cell.removeEventListener('click', populateCell));
  }

  function enableAllCells() {
    cells.forEach((cell) => cell.addEventListener('click', populateCell));
  }

  function restartGame(winner, loser) {
    const restartInterface = document.querySelector('.restart');
    const restartInfo = document.querySelector('.restart-info');

    disableAllCells();

    if (winner !== undefined) {
      const playerOneScore = document.querySelector('.score-p1');
      const playerTwoScore = document.querySelector('.score-p2');
      const name = winner.name;
      winner.score++;

      if (loser.isComputer) {
        playerOneScore.textContent = `${name}: ${winner.score}`;
        restartInfo.textContent = `${name} is the winner!`;
        restartInterface.style.display = 'block';
      } else if (winner.isComputer) {
        playerTwoScore.textContent = `${name}: ${winner.score}`;
        restartInfo.textContent = `${name} is the winner!`;
        restartInterface.style.display = 'block';
      } else {
        if (playerOneScore.textContent.includes(name)) {
          playerOneScore.textContent = `${name} (P1): ${winner.score}`;
          restartInfo.textContent = `${name} is the winner!`;
        } else {
          playerTwoScore.textContent = `${name} (P2): ${winner.score}`;
          restartInfo.textContent = `${name} is the winner!`;
        }
        restartInterface.style.display = 'block';
      }
    }
  }

  function restartDraw() {
    const restartInterface = document.querySelector('.restart');
    const restartInfo = document.querySelector('.restart-info');
    const text = "It's a draw!";

    disableAllCells();
    restartInfo.textContent = text;
    restartInterface.style.display = 'block';
  }

  function restart(e) {
    if (e.target.classList.contains('side-icon')) {
      e.target.style.display = 'none';
    }
    emptyCells();
    enableAllCells();
    const restartInterface = document.querySelector('.restart');
    restartInterface.style.display = 'none';

    isPlayerOnesTurn = true;
    firsttMove = true;
  }

  function emptyCells() {
    cells.forEach((cell) => {
      if (cell.hasChildNodes()) {
        const img = document.querySelector('.cell > img');
        cell.removeChild(img);
      }
    });
    board.emptyBoard();
  }

  restartIcons.forEach((icon) => icon.addEventListener('click', restart));
  cells.forEach((cell) => cell.addEventListener('click', populateCell));
};

const interfaceHandler = (() => {
  const buttons = document.querySelectorAll('button');
  const welcomeInterface = document.querySelector('.welcome');
  const pvpInterface = document.querySelector('.pvp');
  const pvcInterface = document.querySelector('.pvc');
  const restartInterface = document.querySelector('.restart');
  const playerOneName = document.getElementById('player1');
  const playerTwoName = document.getElementById('player2');
  const name = document.getElementById('name');
  const circleOne = document.getElementById('circle1');
  const circleOneImg = document.getElementById('circleOneImg');
  const xOne = document.getElementById('x1');
  const xOneImg = document.getElementById('xOneImg');
  const circleTwo = document.getElementById('circle2');
  const circleTwoImg = document.getElementById('circleTwoImg');
  const xTwo = document.getElementById('x2');
  const xTwoImg = document.getElementById('xTwoImg');
  const circle = document.getElementById('circle');
  const circleImg = document.getElementById('circle-img');
  const x = document.getElementById('x');
  const xImg = document.getElementById('x-img');
  const playerOneScore = document.querySelector('.score-p1');
  const playerTwoScore = document.querySelector('.score-p2');
  const info = document.querySelector('.info');
  const closeIcon = document.querySelector('.close-icon');
  const restartSideIcon = document.querySelector('.side-icon');

  function markerHandler() {
    if (circleOne.checked) {
      circleOneImg.classList.add('selected');
      xOneImg.classList.remove('selected');
    } else if (xOne.checked) {
      xOneImg.classList.add('selected');
      circleOneImg.classList.remove('selected');
    }
    if (circleTwo.checked) {
      circleTwoImg.classList.add('selected');
      xTwoImg.classList.remove('selected');
    } else if (xTwo.checked) {
      xTwoImg.classList.add('selected');
      circleTwoImg.classList.remove('selected');
    }

    if (circle.checked) {
      circleImg.classList.add('selected');
      xImg.classList.remove('selected');
    } else if (x.checked) {
      xImg.classList.add('selected');
      circleImg.classList.remove('selected');
    }
  }

  function buttonHandler(e) {
    const text = e.target.textContent;
    switch (text) {
      case 'Play against a human':
        welcomeInterface.style.display = 'none';
        pvpInterface.style.display = 'block';
        break;
      case 'Play against the computer':
        welcomeInterface.style.display = 'none';
        pvcInterface.style.display = 'block';
        break;
      case 'New game against a different opponent':
        location.reload();
        break;
      case 'Start':
        if (pvpInterface.style.display === 'block') {
          if (playerOneName.value === '' || playerTwoName.value === '') {
            alert('Please type in the names of the players.');
          } else if ((xOne.checked && xTwo.checked) || (circleOne.checked && circleTwo.checked)) {
            alert('Please have each player choose different markers.');
          } else {
            pvpInterface.style.display = 'none';
            info.textContent = 'Player 1 starts first';
            info.classList.add('appear');

            const pOneName = playerOneName.value;
            let pOneMarker;
            if (circleOne.checked) pOneMarker = 'O';
            else pOneMarker = 'X';
            const playerOne = player(pOneName, pOneMarker);

            const pTwoName = playerTwoName.value;
            let pTwoMarker;
            if (circleTwo.checked) pTwoMarker = 'O';
            else pTwoMarker = 'X';
            const playerTwo = player(pTwoName, pTwoMarker);

            playerOneScore.textContent = `${pOneName} (P1): 0`;
            playerTwoScore.textContent = `${pTwoName} (P2): 0`;

            game(playerOne, playerTwo);
            resetInput();
          }
        } else if (pvcInterface.style.display === 'block') {
          if (name.value !== '') {
            pvcInterface.style.display = 'none';
            info.textContent = 'Player starts first';
            info.classList.add('appear');

            const playerName = name.value;
            let playerMarker;
            let computerMarker;
            if (circle.checked) {
              playerMarker = 'O';
              computerMarker = 'X';
            } else {
              playerMarker = 'X';
              computerMarker = 'O';
            }

            const humanPlayer = player(playerName, playerMarker);
            const ai = computer('The computer', computerMarker);

            playerOneScore.textContent = `${playerName}: 0`;
            playerTwoScore.textContent = `The computer: 0`;

            game(humanPlayer, ai);
            resetInput();
          } else {
            alert('Please type in your name.');
          }
        }
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  function closeWindow() {
    restartInterface.style.display = 'none';
    restartSideIcon.style.display = 'block';
  }

  function resetInput() {
    playerOneName.value = '';
    playerTwoName.value = '';
    circleOne.checked = true;
    xTwo.checked = true;
    name.value = '';
    circle.checked = true;
    markerHandler();
  }

  circleOne.addEventListener('click', markerHandler);
  xOne.addEventListener('click', markerHandler);
  circleTwo.addEventListener('click', markerHandler);
  xTwo.addEventListener('click', markerHandler);
  circle.addEventListener('click', markerHandler);
  x.addEventListener('click', markerHandler);
  closeIcon.addEventListener('click', closeWindow);
  buttons.forEach((button) => button.addEventListener('click', buttonHandler));
})();
