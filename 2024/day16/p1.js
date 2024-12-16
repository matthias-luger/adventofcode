const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let [map, width, height, startingPosition] = buildMap(lines)
    let [result] = findShortestPath(map, startingPosition)
    console.log(result.currentScore)
})

function findShortestPath(map, startingPosition) {
    let shortestToPosMap = new Map()
    let paths = [{ path: [], currentPosition: startingPosition, currentDirection: 'E', currentScore: 0 }]
    let finished = []
    while (paths.length > 0) {
        let p = paths.shift()
        let { path, currentPosition, currentDirection, currentScore } = p
        let currentField = map.get(currentPosition)
        if (currentField === 'E') {
            finished.push({ path, currentScore, currentPosition, currentDirection })
            continue
        }
        if (currentField === '#') {
            continue
        }
        if (shortestToPosMap.has(currentPosition)) {
            if (shortestToPosMap.get(currentPosition) < currentScore) {
                continue
            }
        }

        shortestToPosMap.set(currentPosition, currentScore)
        let [x, y] = currentPosition.split(':').map(Number)
        if (currentDirection !== 'S') {
            paths.push({
                path: [...path, currentPosition],
                currentPosition: `${x}:${y - 1}`,
                currentDirection: 'N',
                currentScore: currentDirection === 'N' ? currentScore + 1 : currentScore + 1001
            })
        }
        if (currentDirection !== 'W') {
            paths.push({
                path: [...path, currentPosition],
                currentPosition: `${x + 1}:${y}`,
                currentDirection: 'E',
                currentScore: currentDirection === 'E' ? currentScore + 1 : currentScore + 1001
            })
        }
        if (currentDirection !== 'N') {
            paths.push({
                path: [...path, currentPosition],
                currentPosition: `${x}:${y + 1}`,
                currentDirection: 'S',
                currentScore: currentDirection === 'S' ? currentScore + 1 : currentScore + 1001
            })
        }
        if (currentDirection !== 'E') {
            paths.push({
                path: [...path, currentPosition],
                currentPosition: `${x - 1}:${y}`,
                currentDirection: 'W',
                currentScore: currentDirection === 'W' ? currentScore + 1 : currentScore + 1001
            })
        }
    }
    return finished.sort((a, b) => a.currentScore - b.currentScore)
}

function buildMap(lines) {
    let map = new Map()
    let width = lines[0].length
    let height = 0
    let current = '0:0'

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]
        height++
        for (let x = 0; x < line.length; x++) {
            if (line[x] === 'S') {
                current = `${x}:${y}`
            }
            map.set(`${x}:${y}`, line[x])
        }
    }

    return [map, width, height, current]
}
