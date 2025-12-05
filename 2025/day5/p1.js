const fs = require("fs");

fs.readFile("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let lines = data.split("\r\n");

  let sum = 0;
  let { ranges, ids } = parseInput(lines);
  for (const id in ids) {
    if (isValid(ids[id], ranges)) {
      sum++;
    }
  }
  console.log(sum);
});

function isValid(id, ranges) {
  for (let [start, end] of ranges) {
    if (id >= start && id <= end) {
      return true;
    }
  }
  return false;
}

function parseInput(lines) {
  let ranges = [];
  let ids = [];
  let isParsingRanges = true;
  for (let line of lines) {
    if (line === "") {
      isParsingRanges = false;
      continue;
    }
    if (isParsingRanges) {
      let [start, end] = line.split("-");
      ranges.push([parseInt(start), parseInt(end)]);
    } else {
      ids.push(parseInt(line));
    }
  }
  return { ranges, ids };
}
