const player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  let isComputer = false;
  return { getName, getMarker, isComputer };
};

const gameBoard = () => {
  const board = ['', '', '', '', '', '', '', '', ''];
};

const interfaceHandler = (() => {
  const buttons = document.querySelectorAll('button');
  const welcomeInterface = document.querySelector('.welcome');
  const pvpInterface = document.querySelector('.pvp');
  const pvcInterface = document.querySelector('.pvc');
  const restartPVP = document.querySelector('.restart-pvp');
  const restartPVC = document.querySelector('.restart-pvc');
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
            restartPVC.style.display = 'none';
            pvpInterface.style.display = 'block';
            break;
        case 'Play against the computer':
            welcomeInterface.style.display = 'none';
            restartPVP.style.display = 'none';
            pvcInterface.style.display = 'block';
            break;
        case 'Play against a different player':
            restartPVP.style.display = 'none';
            pvpInterface.style.display = 'block';
            break;
        case 'Start':
            if (pvpInterface.style.display === 'block') {
                if (playerOneName.value === '' || playerTwoName.value === '') {
                    alert('Please type in the names of the players.');
                } else if ((xOne.checked && xTwo.checked) || (circleOne.checked && circleTwo.checked)) {
                    alert('Please have each player choose different markers.');
                } else {
                    pvpInterface.style.display = 'none';

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
                    
                    // Start the Game
                }
            } else if (pvcInterface.style.display === 'block') {
                if (name.value !== '') {
                    pvcInterface.style.display = 'none';

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
                    const computer = player('Computer', computerMarker);

                    playerOneScore.textContent = `${playerName}: 0`;
                    playerTwoScore.textContent = `Computer: 0`;

                    // Start the Game
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

  circleOne.addEventListener('click', markerHandler);
  xOne.addEventListener('click', markerHandler);
  circleTwo.addEventListener('click', markerHandler);
  xTwo.addEventListener('click', markerHandler);
  circle.addEventListener('click', markerHandler);
  x.addEventListener('click', markerHandler);
  buttons.forEach((button) => button.addEventListener('click', buttonHandler));
})();
