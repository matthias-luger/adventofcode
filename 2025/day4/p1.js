const fs = require("fs");

fs.readFile("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let lines = data.split("\r\n");

  const height = lines.length;
  const width = lines[0].length;
  let map = buildMap(lines, width, height);
  let sum = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (map.get(`${x},${y}`) !== "@") continue;
      let neighbours = getNumberOfNeighbours(map, x, y);
      if (neighbours < 4) {
        sum++;
      }
    }
  }
  console.log(sum);
});

function getNumberOfNeighbours(map, x, y) {
  let numberOfNeighbours = 0;
  let directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  for (let dir of directions) {
    if (map.get(`${x + dir[0]},${y + dir[1]}`) === "@") {
      numberOfNeighbours++;
    }
  }
  return numberOfNeighbours;
}

function buildMap(lines, width, height) {
  let map = new Map();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      map.set(`${x},${y}`, lines[y][x]);
    }
  }
  return map;
}
