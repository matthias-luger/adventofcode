const fs = require("fs");

fs.readFile("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let lines = data.split("\r\n");
  let input = parseInput(lines);

  let sum = 0;
  for (const calculation of input) {
    sum += calculation.numbers.reduce((a, b) =>
      calculate(+a, +b, calculation.symbol)
    );
  }
  console.log(sum);
});

function calculate(a, b, symbol) {
  switch (symbol) {
    case "+":
      return a + b;
    case "*":
      return a * b;
  }
}

function parseInput(lines) {
  let calculations = [{ numbers: [] }];
  let height = lines.length;
  let width = lines[0].length;

  for (let x = width - 1; x >= 0; x--) {
    let number = "";
    for (let y = 0; y < height; y++) {
      let char = lines[y][x];
      if (char.match(" " || "")) {
        continue;
      } else {
        if (char === "+" || char === "*") {
          x--;
          calculations[calculations.length - 1].symbol = char;
          calculations[calculations.length - 1].numbers.push(number);
          number = "";
          calculations.push({ numbers: [] });
        } else {
          number += char;
        }
      }
    }
    if (number !== "") {
      calculations[calculations.length - 1].numbers.push(number);
    }
  }
  return calculations.slice(0, calculations.length - 1);
}
