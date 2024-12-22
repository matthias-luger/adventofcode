const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let [map, current] = buildMap(lines)
    let shortestRegular = findShortestPath(map, current)
    let { sum } = getPossibleCheatCoordinates(shortestRegular[0].path, 100, 20)
    console.log(sum)
})

function getPossibleCheatCoordinates(originalPath, minimumSave, maxCheat) {
    let possibleCheatCoordnates = new Map()
    let sum = 0
    let path = originalPath.map(p => p.split(':').map(Number))

    for (let i = 0; i < path.length - 1; i++) {
        for (let j = i + 1; j < path.length; j++) {
            let [xA, yA] = path[i]
            let [xB, yB] = path[j]
            let dist = Math.abs(xA - xB) + Math.abs(yA - yB)
            if (dist > maxCheat) {
                continue
            }
            let normalDistance = Math.abs(i - j)

            let save = normalDistance - dist
            if (save >= minimumSave) {
                sum++
                if (possibleCheatCoordnates.has(save)) {
                    possibleCheatCoordnates.set(save, possibleCheatCoordnates.get(save) + 1)
                } else {
                    possibleCheatCoordnates.set(save, 1)
                }
            }
        }
    }
    return { sum, possibleCheatCoordnates }
}

function findShortestPath(map, startingPosition) {
    let shortestToPosMap = new Map()
    let paths = [{ path: [], currentPosition: startingPosition, currentScore: 0 }]
    let finished = []
    while (paths.length > 0) {
        let p = paths.shift()
        let { path, currentPosition, currentScore } = p
        let currentField = map.get(currentPosition)
        if (currentField === 'E') {
            finished.push({ path: [...path, currentPosition], currentScore, currentPosition })
            continue
        }
        if (!currentField) {
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
        paths.push({ path: [...path, currentPosition], currentPosition: `${x + 1}:${y}`, currentScore: currentScore + 1 })
        paths.push({ path: [...path, currentPosition], currentPosition: `${x}:${y + 1}`, currentScore: currentScore + 1 })
        paths.push({ path: [...path, currentPosition], currentPosition: `${x}:${y - 1}`, currentScore: currentScore + 1 })
        paths.push({ path: [...path, currentPosition], currentPosition: `${x - 1}:${y}`, currentScore: currentScore + 1 })
    }

    return finished.sort((a, b) => a.currentScore - b.currentScore)
}

function buildMap(lines) {
    let map = new Map()
    let current = '0:0'

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]
        for (let x = 0; x < line.length; x++) {
            if (line[x] === 'S') {
                current = `${x}:${y}`
            }
            map.set(`${x}:${y}`, line[x])
        }
    }

    return [map, current]
}
