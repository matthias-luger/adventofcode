const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let [map, width, height, current] = buildMap(lines)
    let shortestRegular = findShortestPath(map, current)
    let cheatCoordinates = getPossibleCheatCoordinates(map, width, height)

    let sum = 0
    for (const cheat of cheatCoordinates) {
        let cheatSavedTime = getCheatSavedTime(shortestRegular[0].path, cheat)
        if (cheatSavedTime >= 100) {
            sum += 1
        }
    }
    console.log(sum)
})

function getCheatSavedTime(regularPath, cheatCoordinates) {
    let [cheatX, cheatY] = cheatCoordinates.split(':').map(Number)
    let neightbours = [`${cheatX + 1}:${cheatY}`, `${cheatX}:${cheatY + 1}`, `${cheatX - 1}:${cheatY}`, `${cheatX}:${cheatY - 1}`]
    let inicies = neightbours.map(n => regularPath.findIndex(p => p === n)).filter(i => i !== -1)
    let min = Math.min(...inicies)
    let max = Math.max(...inicies)

    return max - min - 2
}

function getPossibleCheatCoordinates(map, width, height) {
    let neightbours = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ]
    let possibleCheatCoordnates = new Set()

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let current = map.get(`${x}:${y}`)
            if (current === '#') {
                let count = 0
                for (let [dx, dy] of neightbours) {
                    let neighbour = map.get(`${x + dx}:${y + dy}`)
                    if (neighbour !== '#' && neighbour !== undefined) {
                        count++
                    }
                }
                if (count >= 2) {
                    possibleCheatCoordnates.add(`${x}:${y}`)
                }
            }
        }
    }
    return Array.from(possibleCheatCoordnates)
}

function findShortestPath(map, startingPosition) {
    let shortestToPosMap = new Map()
    let paths = [{ path: [startingPosition], currentPosition: startingPosition, currentScore: 0 }]
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
