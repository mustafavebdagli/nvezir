const nInput = document.getElementById('nValue');
const solveBtn = document.getElementById('solveBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const infoLabel = document.getElementById('infoLabel');
const boardEl = document.getElementById('board');

let solutions = [];
let currentIndex = 0;
let currentN = 4;

function solveNQueens(n) {
  const solutions = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));

  const usedColumns = new Set();
  const usedDiag1 = new Set(); // row - col
  const usedDiag2 = new Set(); // row + col

  function isSafe(row, col) {
    if (usedColumns.has(col)) return false;
    if (usedDiag1.has(row - col)) return false;
    if (usedDiag2.has(row + col)) return false;
    return true;
  }

  function placeQueen(row, col) {
    board[row][col] = 'Q';
    usedColumns.add(col);
    usedDiag1.add(row - col);
    usedDiag2.add(row + col);
  }

  function removeQueen(row, col) {
    board[row][col] = '.';
    usedColumns.delete(col);
    usedDiag1.delete(row - col);
    usedDiag2.delete(row + col);
  }

  function saveSolution() {
    solutions.push(board.map(row => row.join('')));
  }

  function backtrack(row) {
    if (row === n) {
      saveSolution();
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        placeQueen(row, col);
        backtrack(row + 1);
        removeQueen(row, col);
      }
    }
  }

  backtrack(0);
  return solutions;
}

function getCellSize(n) {
  if (n <= 6) return 72;
  if (n <= 8) return 62;
  if (n <= 10) return 52;
  if (n <= 12) return 44;
  return 36;
}

function drawSolution(solution) {
  boardEl.innerHTML = '';

  const n = solution.length;
  const cellSize = getCellSize(n);
  boardEl.style.gridTemplateColumns = `repeat(${n + 1}, ${cellSize}px)`;

  const topLeft = document.createElement('div');
  topLeft.className = 'cell axis-cell';
  boardEl.appendChild(topLeft);

  for (let col = 0; col < n; col++) {
    const label = document.createElement('div');
    label.className = 'cell axis-cell';
    label.style.height = `${cellSize}px`;
    label.textContent = col;
    boardEl.appendChild(label);
  }

  for (let row = 0; row < n; row++) {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'cell axis-cell';
    rowLabel.style.width = `${cellSize}px`;
    rowLabel.style.height = `${cellSize}px`;
    rowLabel.textContent = row;
    boardEl.appendChild(rowLabel);

    for (let col = 0; col < n; col++) {
      const cell = document.createElement('div');
      cell.className = `cell ${(row + col) % 2 === 0 ? 'square-light' : 'square-dark'}`;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;

      if (solution[row][col] === 'Q') {
        const queen = document.createElement('span');
        queen.className = 'queen';
        queen.textContent = '♛';
        queen.style.fontSize = `${Math.max(22, Math.floor(cellSize * 0.55))}px`;
        queen.style.fontWeight = '700';
        cell.appendChild(queen);
      }

      boardEl.appendChild(cell);
    }
  }
}

function updateButtons() {
  prevBtn.disabled = currentIndex === 0 || solutions.length === 0;
  nextBtn.disabled = currentIndex === solutions.length - 1 || solutions.length === 0;
}

function updateInfo() {
  if (solutions.length === 0) {
    infoLabel.textContent = `N = ${currentN} için çözüm bulunamadı.`;
    return;
  }

  infoLabel.textContent = `N = ${currentN} için toplam ${solutions.length} çözüm bulundu. Şu an ${currentIndex + 1}. çözüm gösteriliyor.`;
}

function solveAndShow() {
  const value = nInput.value.trim();

  if (!/^\d+$/.test(value)) {
    alert('Lütfen pozitif bir tam sayı girin.');
    return;
  }

  const n = Number(value);

  if (n <= 0) {
    alert('N değeri 0\'dan büyük olmalıdır.');
    return;
  }

  if (n > 14) {
    const confirmed = confirm('N değeri büyüdükçe çözüm süresi uzar. Devam etmek istiyor musun?');
    if (!confirmed) return;
  }

  currentN = n;
  infoLabel.textContent = 'Çözümler hesaplanıyor...';
  boardEl.innerHTML = '';

  setTimeout(() => {
    solutions = solveNQueens(n);
    currentIndex = 0;

    if (solutions.length === 0) {
      updateInfo();
      updateButtons();
      boardEl.innerHTML = '';
      return;
    }

    drawSolution(solutions[currentIndex]);
    updateInfo();
    updateButtons();
  }, 10);
}

solveBtn.addEventListener('click', solveAndShow);

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    drawSolution(solutions[currentIndex]);
    updateInfo();
    updateButtons();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < solutions.length - 1) {
    currentIndex += 1;
    drawSolution(solutions[currentIndex]);
    updateInfo();
    updateButtons();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  solveAndShow();
});
