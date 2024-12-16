const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let [map, width, height, current, moves] = buildMap(lines)
    simulateMoves(map, moves, current)

    //paint(map, width, height)
    console.log(getScore(map, width, height))
})

function getScore(map, width, height) {
    let score = 0
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (map.get(`${x}:${y}`) === 'O') {
                score += x + y * 100
            }
        }
    }
    return score
}

function simulateMoves(map, moves, startingPosition) {
    let position = startingPosition
    for (const move of moves) {
        position = moveIfPossible(map, position, move)
    }
}

function moveIfPossible(map, position, direction) {
    let [x, y] = position.split(':').map(Number)
    let [dx, dy] = direction
    if (canMove(map, position, direction)) {
        move(map, position, direction)
        let newPosition = `${x + dx}:${y + dy}`
        return newPosition
    }
    return position
}

function move(map, position, direction) {
    let [x, y] = position.split(':').map(Number)
    let [dx, dy] = direction
    let newPosition = `${x + dx}:${y + dy}`
    if (map.get(newPosition) === 'O') {
        move(map, newPosition, direction)
    }
    if (map.get(newPosition) === '.') {
        map.set(newPosition, map.get(position))
        map.set(position, '.')
    }
}

function canMove(map, position, direction) {
    let [x, y] = position.split(':').map(Number)
    let [dx, dy] = direction
    let newPosition = `${x + dx}:${y + dy}`
    if (!map.has(newPosition)) {
        return false
    }
    if (map.get(newPosition) === '#') {
        return false
    }
    if (map.get(newPosition) === '.') {
        return true
    }
    if (map.get(newPosition) === 'O') {
        return canMove(map, newPosition, direction)
    }
}

function paint(map, width, height) {
    for (let y = 0; y < height; y++) {
        let line = ''
        for (let x = 0; x < width; x++) {
            line += map.get(`${x}:${y}`)
        }
        console.log(line)
    }
}

function buildMap(lines) {
    let map = new Map()
    let width = lines[0].length
    let height = 0
    let current = '0:0'
    let moves = []

    let isParsingMap = true

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]

        if (line === '') {
            isParsingMap = false
            continue
        }
        if (isParsingMap) {
            height++
            for (let x = 0; x < line.length; x++) {
                if (line[x] === '@') {
                    current = `${x}:${y}`
                }
                map.set(`${x}:${y}`, line[x])
            }
        } else {
            let newMoves = line.split('').map(dir => {
                if (dir === '^') return [0, -1]
                if (dir === 'v') return [0, 1]
                if (dir === '>') return [1, 0]
                if (dir === '<') return [-1, 0]
            })
            moves.push(...newMoves)
        }
    }

    return [map, width, height, current, moves]
}
