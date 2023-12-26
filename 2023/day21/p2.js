const fs = require('fs')
const MAX_STEPS = 26501365

// This solution makes a few assumpitons about the input:
// - The map is square
// - The starting point is in the middle of the map
// - From the starting point you can go in all directions without a hitting a wall
// - The size of the map is uneven and can be divided by the number of steps we have to take

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let { map, startingPoint } = parseMap(lines)

    let gridWidth = Math.floor(MAX_STEPS / lines.length) - 1
    let oddGrids = (Math.floor(gridWidth / 2) * 2 + 1) ** 2
    let evenGrids = (Math.floor((gridWidth + 1) / 2) * 2) ** 2

    let pointsPerOddGrid = fill(map, startingPoint, lines.length * 2 + 1)
    let pointsPerEvenGrid = fill(map, startingPoint, lines.length * 2)

    let corner_top = fill(map, { y: lines.length - 1, x: startingPoint.x }, lines.length - 1)
    let corner_right = fill(map, { y: startingPoint.y, x: 0 }, lines.length - 1)
    let corner_bottom = fill(map, { y: 0, x: startingPoint.x }, lines.length - 1)
    let corner_left = fill(map, { y: startingPoint.y, x: lines.length - 1 }, lines.length - 1)

    let smallPart_top_right = fill(map, { y: lines.length - 1, x: 0 }, Math.floor(lines.length / 2) - 1)
    let smallPart_top_left = fill(map, { y: lines.length - 1, x: lines.length - 1 }, Math.floor(lines.length / 2) - 1)
    let smallPart_bottom_right = fill(map, { y: 0, x: 0 }, Math.floor(lines.length / 2) - 1)
    let smallPart_bottom_left = fill(map, { y: 0, x: lines.length - 1 }, Math.floor(lines.length / 2) - 1)

    let largePart_top_right = fill(map, { y: lines.length - 1, x: 0 }, Math.floor((lines.length * 3) / 2) - 1)
    let largePart_top_left = fill(map, { y: lines.length - 1, x: lines.length - 1 }, Math.floor((lines.length * 3) / 2) - 1)
    let largePart_bottom_right = fill(map, { y: 0, x: 0 }, Math.floor((lines.length * 3) / 2) - 1)
    let largePart_bottom_left = fill(map, { y: 0, x: lines.length - 1 }, Math.floor((lines.length * 3) / 2) - 1)

    let sumOddGrids = oddGrids * pointsPerOddGrid
    let sumEvenGrids = evenGrids * pointsPerEvenGrid
    let sumCorners = corner_top + corner_right + corner_bottom + corner_left
    let sumSmallParts = (gridWidth + 1) * (smallPart_top_right + smallPart_top_left + smallPart_bottom_right + smallPart_bottom_left)
    let sumLargeParst = gridWidth * (largePart_top_right + largePart_top_left + largePart_bottom_right + largePart_bottom_left)

    let result = sumOddGrids + sumEvenGrids + sumCorners + sumSmallParts + sumLargeParst

    console.log(result)
})

function fill(map, startingPoint, maxSteps) {
    let paths = [{ ...startingPoint, stepsLeft: maxSteps }]
    let possibleEndpositions = new Set()
    let cache = new Set()

    while (paths.length > 0) {
        let path = paths.shift()

        if (path.stepsLeft % 2 === 0) {
            possibleEndpositions.add(`${path.x},${path.y}`)
        }
        if (path.stepsLeft === 0) continue

        let directions = [
            { x: path.x - 1, y: path.y },
            { x: path.x + 1, y: path.y },
            { x: path.x, y: path.y - 1 },
            { x: path.x, y: path.y + 1 }
        ]

        for (let direction of directions) {
            let key = `${direction.x},${direction.y}`
            if (map.get(key) === '#' || map.get(key) === undefined || cache.has(key)) {
                continue
            }
            cache.add(`${key}`)
            paths.push({ ...direction, stepsLeft: path.stepsLeft - 1 })
        }
    }

    return possibleEndpositions.size
}

function parseMap(lines) {
    let startingPoint = null
    let map = new Map()
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        for (let j = 0; j < line.length; j++) {
            let char = line[j]
            if (char === 'S') {
                startingPoint = { x: j, y: i }
            }
            map.set(`${j},${i}`, char)
        }
    }
    return {
        map,
        startingPoint
    }
}
