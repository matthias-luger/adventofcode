const fs = require("fs");

fs.readFile("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let lines = data.split("\r\n");

  let sum = 0;
  let { ranges } = parseInput(lines);

  let didMerge = true;
  ranges.sort((a, b) => a[0] - b[0]);
  while (didMerge) {
    didMerge = false;
    for (let i = ranges.length - 1; i > 0; i--) {
      let newMerge = mergeIfPossible(ranges[i], ranges[i - 1]);
      if (newMerge) {
        ranges.splice(i - 1, 2, newMerge);
        didMerge = true;
      }
    }
  }

  for (const range in ranges) {
    sum += ranges[range][1] - ranges[range][0] + 1;
  }
  console.log(sum);
});

function mergeIfPossible(range1, range2) {
  let [start1, end1] = range1;
  let [start2, end2] = range2;
  let sorted = [...range1, ...range2].sort((a, b) => a - b);

  let mergeRight = [start1, start2, end1, end2];
  let mergeLeft = [start2, start1, end2, end1];
  let inside1 = [start1, start2, end2, end1];
  let inside2 = [start2, start1, end1, end2];

  if (
    [mergeRight, mergeLeft, inside1, inside2].some((arr) =>
      arr.every((val, index) => val === sorted[index])
    )
  ) {
    return [Math.min(start1, start2), Math.max(end1, end2)];
  }

  return null;
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
