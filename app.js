const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
let playerGo = "Tom";
playerDisplay.textContent = "Tom";
const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];

function createBoard() {
  startPieces.forEach((startPieces, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPieces;
    square.firstChild?.setAttribute("draggable", true);
    square.setAttribute("square-id", i);
    //square.classList.add('beige')
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "beige");
    }
    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }
    gameBoard.append(square);
  });
}
createBoard();
const allSquares = document.querySelectorAll(".square");
allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});
let startPositionId;
let draggedElement;
function dragStart(e) {
  startPositionId = e.target.getAttribute("square-id");
  draggedElement = e.target.cloneNode(true);
  draggedElement.id = e.target.id;
}
function dragOver(e) {
  e.preventDefault();
}
function dragDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log("playerGo", playerGo);
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValid(e.target);
  const opponentGo = playerGo === "Anne" ? "Tom" : "Anne";
  console.log("opponentGo", opponentGo);
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

  if (correctGo) {
    // must check this first
    if (takenByOpponent && valid) {
      e.target.parentNode.append(draggedElement);
      //e.target.parentNode.removeChild(e.target.firstChild);
      changePlayer();
      return;
    }
    // then check this
    else if (taken && !takenByOpponent) {
      infoDisplay.textContent = "You cannot go here!";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    } else if (valid) {
      e.target.append(draggedElement);
      changePlayer();
      return;
    }
  }
  function checkIfValid(target) {
    const targetId =
      Number(target.getAttribute("square-id")) ||
      Number(target.parentNode.getAttribute("square-id"));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;
    console.log("targetId", targetId);
    console.log("startId", startId);
    console.log("piece", piece);

    switch (piece) {
      case "pawn":
        const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
        if (
          (starterRow.includes(startId) && startId + width * 2 === targetId) ||
          startId + width === targetId ||
          (startId + width - 1 === targetId &&
            document.querySelector(`[square-id="${startId + width - 1}"]`)
              .firstChild) ||
          (startId + width + 1 === targetId &&
            document.querySelector(`[square-id="${startId + width + 1}"]`)
              .firstChild)
        ) {
          return true;
        }
        break;
      case "knight":
        if (
          startId + width * 2 + 1 === targetId ||
          startId + width * 2 - 1 === targetId ||
          startId + width - 2 === targetId ||
          startId + width + 2 === targetId ||
          startId - width * 2 + 1 === targetId ||
          startId - width * 2 - 1 === targetId ||
          startId - width - 2 === targetId ||
          startId - width + 2 === targetId
        ) {
          return true;
        }
        break;
      case "bishop":
        if (
          startId + width + 1 === targetId ||
          (startId + width * 2 + 2 &&
            !document.querySelector(`[sqaure-id= ${startId + width + 1}]`)
              .firstChild) ||
          (startId + width * 3 + 3 &&
            !document.querySelector(`[sqaure-id= ${startId + width + 1}]`)
              .firstChild)
        ) {
          return true;
        }
        break;
    }
    return false;
  }
  //e.target.append(draggedElement)
  changePlayer();
}
function changePlayer() {
  if (playerGo === "Tom") {
    reverseIds();
    playerGo = "Anne";
    playerDisplay.textContent = "Anne";
  } else {
    revertIds();
    playerGo = "Tom";
    playerDisplay.textContent = "Tom";
  }
}
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute("square-id", width * width - 1 - i)
  );
}
function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => square.setAttribute("square-id", i));
}
