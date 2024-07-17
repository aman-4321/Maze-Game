const shuffle = (arr) => {
  let counter = arr.length - 1;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter + 1);
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
    counter -= 1;
  }
};

const visitCells = (row, column) => {
  // if cell visited return
  if (grid[row][column]) return;

  // mark cell as visited.
  grid[row][column] = true;

  // create a random list of neighbours
  const neighbours = [
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ];
  shuffle(neighbours);

  // for each neighbhour
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;

    // checkits not out of bound
    if (
      nextRow < 0 ||
      nextRow >= cellsY ||
      nextColumn < 0 ||
      nextColumn >= cellsX
    )
      continue;

    // check if its not visited
    if (grid[nextRow][nextColumn]) continue;

    // remove the wall
    switch (direction) {
      case "left":
        verticals[row][column - 1] = true;
        break;
      case "right":
        verticals[row][column] = true;
        break;
      case "up":
        horizontals[row - 1][column] = true;
        break;
      case "down":
        horizontals[row][column] = true;
    }

    visitCells(nextRow, nextColumn);
  }
};
