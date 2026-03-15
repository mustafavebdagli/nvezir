const nInput = document.getElementById('nValue');
const solveBtn = document.getElementById('solveBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const infoText = document.getElementById('infoText');
const totalSolutionsEl = document.getElementById('totalSolutions');
const currentSolutionEl = document.getElementById('currentSolution');
const boardEl = document.getElementById('board');
const boardSizeBadge = document.getElementById('boardSizeBadge');

let solutions = [];
let currentIndex = 0;
let currentN = 4;

function solveNQueens(n) {
  const results = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  const usedColumns = new Set();
  const usedDiag1 = new Set();
  const usedDiag2 = new Set();

  function isSafe(row, col) {
    return !usedColumns.has(col) && !usedDiag1.has(row - col) && !usedDiag2.has(row + col);
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
    results.push(board.map(row => row.join('')));
  }

  function backtrack(row) {
    if (row === n) {
      saveSolution();
      return;
    }

    for (let col = 0; col < n; col += 1) {
      if (isSafe(row, col)) {
        placeQueen(row, col);
        backtrack(row + 1);
        removeQueen(row, col);
      }
    }
  }

  backtrack(0);
  return results;
}

function renderEmptyBoard(message = 'Henüz çözüm oluşturulmadı.') {
  boardEl.innerHTML = <div class="empty-state">${message}</div>;
}

function drawSolution(solution) {
  const n = solution.length;
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = repeat(${n + 1}, auto);

  const topLeft = document.createElement('div');
  topLeft.className = 'coord-cell';
  boardEl.appendChild(topLeft);

  for (let col = 0; col < n; col += 1) {
    const label = document.createElement('div');
    label.className = 'coord-cell';
    label.textContent = col;
    boardEl.appendChild(label);
  }

  for (let row = 0; row < n; row += 1) {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'coord-cell';
    rowLabel.textContent = row;
    boardEl.appendChild(rowLabel);

    for (let col = 0; col < n; col += 1) {
      const square = document.createElement('div');
      const tone = (row + col) % 2 === 0 ? 'light' : 'dark';
      square.className = cell square ${tone};
      if (solution[row][col] === 'Q') {
        square.innerHTML = '<span class="queen">♛</span>';
      }
      boardEl.appendChild(square);
    }
  }
}

function updateButtons() {
  prevBtn.disabled = currentIndex <= 0 || solutions.length === 0;
  nextBtn.disabled = currentIndex >= solutions.length - 1 || solutions.length === 0;
}

function updateInfo() {
  if (!solutions.length) {
    totalSolutionsEl.textContent = '0';
    currentSolutionEl.textContent = '-';
    infoText.textContent = N = ${currentN} için çözüm bulunamadı.;
    return;
  }

  totalSolutionsEl.textContent = String(solutions.length);
  currentSolutionEl.textContent = ${currentIndex + 1} / ${solutions.length};
  infoText.textContent = N = ${currentN} için toplam ${solutions.length} çözüm bulundu. Şu an ${currentIndex + 1}. çözüm gösteriliyor.;
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

  if (n > 12) {
    const continueProcess = confirm('12 üzerindeki değerlerde hesaplama yavaşlayabilir. Devam etmek istiyor musun?');
    if (!continueProcess) return;
  }

  currentN = n;
  boardSizeBadge.textContent = N = ${n};
  infoText.textContent = 'Çözümler hesaplanıyor...';
  totalSolutionsEl.textContent = '...';
  currentSolutionEl.textContent = '...';

  setTimeout(() => {
    solutions = solveNQueens(n);
    currentIndex = 0;

    if (!solutions.length) {
      renderEmptyBoard(N = ${n} için çözüm bulunamadı.);
    } else {
      drawSolution(solutions[currentIndex]);
    }

    updateInfo();
    updateButtons();
  }, 30);
}

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

solveBtn.addEventListener('click', solveAndShow);

nInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    solveAndShow();
  }
});

renderEmptyBoard();
updateButtons();
updateInfo();
