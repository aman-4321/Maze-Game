const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

let cellsX = 20,
  cellsY = 14;

const query = window.location.search;
if (query) {
  const urlParams = new URLSearchParams(query);
  let x = urlParams.get("x");
  let y = urlParams.get("y");
  if (x && y && x <= 40 && x >= 5 && y <= 25 && y >= 5) {
    cellsX = parseInt(x);
    cellsY = parseInt(y);
  }
}

console.log(cellsX, cellsY);

const width = window.innerWidth - 5;
const height = window.innerHeight - 5;
const unitLengthX = width / cellsX;
const unitLengthY = height / cellsY;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
    background: "#fffbdf",
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];
World.add(world, walls);

// Maze generation
const grid = Array(cellsY)
  .fill(null)
  .map(() => Array(cellsX).fill(false));

const verticals = Array(cellsY)
  .fill(null)
  .map(() => Array(cellsX - 1).fill(false));

const horizontals = Array(cellsY - 1)
  .fill(null)
  .map(() => Array(cellsX).fill(false));

const startRow = Math.floor(Math.random() * cellsY);
const startColumn = Math.floor(Math.random() * cellsX);

// creating the maze
visitCells(startRow, startColumn);

//drawing the maze
horizontals.forEach((row, rowIndex) => {
  row.forEach((isOpen, columnIndex) => {
    if (isOpen) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "#334443",
        },
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((isOpen, columnIndex) => {
    if (isOpen) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "#334443",
        },
      }
    );
    World.add(world, wall);
  });
});

// ball
const radius = Math.min(unitLengthY, unitLengthX) / 3;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, radius, {
  label: "ball",
  render: {
    fillStyle: "#28b5b5",
  },
});

//goal
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    label: "goal",
    isStatic: true,
    wireframes: false,
    render: {
      fillStyle: "#fc5404",
    },
  }
);

World.add(world, goal);
World.add(world, ball);

document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;

  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      if (y > -10) Body.setVelocity(ball, { x, y: y - 5 });
      break;
    case "ArrowLeft":
    case "KeyA":
      if (x > -10) Body.setVelocity(ball, { x: x - 5, y });
      break;
    case "ArrowRight":
    case "KeyD":
      if (x < 10) Body.setVelocity(ball, { x: x + 5, y });
      break;
    case "ArrowDown":
    case "KeyS":
      if (y < 10) Body.setVelocity(ball, { x: x, y: y + 5 });
      break;
  }
});

Events.on(engine, "collisionStart", (event) => {
  const labels = ["ball", "goal"];
  console.log("collisions");
  event.pairs.forEach((collision) => {
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
      document.querySelector(".hidden").classList.remove("hidden");
      Events.off(engine, "collisionStart");
    }
  });
});
