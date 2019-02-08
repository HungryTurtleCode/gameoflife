const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution = 10;
canvas.width = 800;
canvas.height = 800;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

class Cell {
  constructor() {
    this.currentstate = Math.floor(Math.random() * 2);
    this.total = 0;
  }
  setState(state) {
    this.currentstate = state;
    this.total += state;
  }
}

function buildGrid() {
  return new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(null)
      .map(() => new Cell()));
}

let grid = buildGrid();

requestAnimationFrame(update);

function update() {
  grid = nextGen(grid);
  render(grid);
  requestAnimationFrame(update);
}

function nextGen(grid) {
  // const nextGen = grid.map(arr => [...arr]);
  const currentGen = grid.map(arr => arr.map(cell => cell.currentstate));

  for (let col = 0; col < currentGen.length; col++) {
    for (let row = 0; row < currentGen[col].length; row++) {
      const cell = currentGen[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
            const currentNeighbour = currentGen[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }

      // rules
      if (cell === 1 && numNeighbours < 2) {
        grid[col][row].setState(0);
      } else if (cell === 1 && numNeighbours > 3) {
        grid[col][row].setState(0);
      } else if (cell === 0 && numNeighbours === 3) {
        grid[col][row].setState(1);
      } else {
        grid[col][row].setState(grid[col][row].currentstate);
      }
    }
  }
  return grid;
}

function render(grid) {
  let maxTotal = 0;
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      if (cell.total > maxTotal) {
        maxTotal = cell.total;
      }
    }
  }

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      const normalised = cell.total / maxTotal;
      const h = (1.0 - normalised) * 240
      ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
      ctx.fill();
      // ctx.stroke();
    }
  }
}

