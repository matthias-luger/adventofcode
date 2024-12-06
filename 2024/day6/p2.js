const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let start = new Date()
    let [map, width, height, startingCoordinates] = buildMap(data)

    let { visited: defaultVisited } = simulate(map, startingCoordinates)

    let visitedCoordinates = Array.from(defaultVisited)

    let numberOfLoops = 0
    for (const coordinates of visitedCoordinates) {
        if (coordinates === startingCoordinates) {
            continue
        }
        let { visited, loop } = simulate(map, startingCoordinates, coordinates.split(':').map(Number))
        if (loop) {
            numberOfLoops++
        }
    }

    console.log(numberOfLoops)
    console.log('Execution time: ', new Date() - start)
})

function simulate(map, startCoordinates, simulatedObstacle) {
    let visited = new Set()
    let visitedWithDirection = new Set()
    let currentPos = startCoordinates
    let direction = [0, -1]
    let loop = false

    while (map.has(currentPos)) {
        let [x, y] = currentPos.split(':').map(Number)
        let nextPos = [x + direction[0], y + direction[1]]
        let next = map.get(`${nextPos[0]}:${nextPos[1]}`)

        if (next === '#' || (simulatedObstacle && simulatedObstacle[0] === nextPos[0] && simulatedObstacle[1] === nextPos[1])) {
            direction = turnDirectionRight(direction)
        } else {
            currentPos = nextPos.join(':')
        }

        if (visitedWithDirection.has(`${currentPos}&${direction.join(':')}`)) {
            loop = true
            break
        }

        visited.add(currentPos)
        visitedWithDirection.add(`${currentPos}&${direction.join(':')}`)
    }
    visited.add(currentPos)

    return { visited, loop }
}

function turnDirectionRight(direction) {
    let [dx, dy] = direction
    if (dx === 0 && dy === -1) return [1, 0]
    if (dx === 1 && dy === 0) return [0, 1]
    if (dx === 0 && dy === 1) return [-1, 0]
    if (dx === -1 && dy === 0) return [0, -1]
}

function buildMap(data) {
    let map = new Map()
    let lines = data.split('\r\n')
    let width = lines[0].length
    let height = lines.length
    let startingCoordinates = '0:0'

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]
        for (let x = 0; x < line.length; x++) {
            if (line[x] === '^') {
                startingCoordinates = `${x}:${y}`
            }
            map.set(`${x}:${y}`, line[x])
        }
    }

    return [map, width, height, startingCoordinates]
}
