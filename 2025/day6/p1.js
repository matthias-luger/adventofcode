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
      calculate(a, b, calculation.symbol)
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
  let calculations = [];
  for (let line of lines) {
    let characters = line.split(/\s+/g).filter((c) => c.length > 0);
    for (let i = 0; i < characters.length; i++) {
      if (!calculations[i]) {
        calculations[i] = {
          numbers: [],
        };
      }
      if (isNaN(characters[i])) {
        calculations[i].symbol = characters[i];
      } else {
        calculations[i].numbers.push(parseInt(characters[i]));
      }
    }
  }
  return calculations;
}
