const fs = require('fs')
const { getAreaRules } = require('./get_area_rules')

const WALL = '#'
const WAY = '.'
const filename = './input.txt'
const CUBE_SIZE = filename.includes('input') ? 50 : 4
const AREA_RULES = getAreaRules(filename, CUBE_SIZE)

fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let [map, player, instructions] = parseLines(lines)

    let x = 0
    while (!map.get(x + ':0')) {
        x++
    }
    player.x = x
    player.y = 0

    for (let i = 0; i < instructions.length; i++) {
        movePlayer(map, player, instructions[i])
    }

    console.log(getScore(player))
})

function parseLines(lines) {
    let map = new Map()
    let player = { x: -1, y: 0, direction: 'O' }
    let instructions = []
    let lineNo = 0
    lines.forEach(value => {
        if (value !== '') {
            if (value[0] !== WALL && value[0] !== ' ' && value[0] !== WAY) {
                for (let i = 0; i < value.length; i++) {
                    const char = value[i]
                    if (!isNaN(char)) {
                        let last = instructions[instructions.length - 1]
                        if (!isNaN(last)) {
                            instructions[instructions.length - 1] = +(last.toString() + char)
                        } else {
                            instructions.push(+char)
                        }
                    } else {
                        instructions.push(char)
                    }
                }
            } else {
                for (let i = 0; i < value.length; i++) {
                    map.set(
                        i + ':' + lineNo,
                        value[i] === ' '
                            ? null
                            : {
                                  area: getArea(i, lineNo),
                                  value: value[i]
                              }
                    )
                }
            }
        }
        lineNo++
    })
    return [map, player, instructions]
}

function getArea(x, y) {
    let row = Math.floor(y / CUBE_SIZE)
    let column = Math.floor(x / CUBE_SIZE) + 1
    return row * 4 + column
}

function getScore(player) {
    let directionScore = 0
    switch (player.direction) {
        case 'N':
            directionScore = 3
            break
        case 'O':
            directionScore = 0
            break
        case 'S':
            directionScore = 1
            break
        case 'W':
            directionScore = 2
            break
    }
    return (player.y + 1) * 1000 + (player.x + 1) * 4 + directionScore
}

function movePlayer(map, player, instruction) {
    if (!isNaN(instruction)) {
        for (let i = 0; i < instruction; i++) {
            let x = player.x
            let y = player.y
            switch (player.direction) {
                case 'N':
                    y--
                    if (isWall(map, x, y)) continue
                    ;[x, y] = makeCornerWalkIfNecessary(map, player, x, y)
                    break
                case 'O':
                    x++
                    if (isWall(map, x, y)) continue
                    ;[x, y] = makeCornerWalkIfNecessary(map, player, x, y)
                    break
                case 'S':
                    y++
                    if (isWall(map, x, y)) continue
                    ;[x, y] = makeCornerWalkIfNecessary(map, player, x, y)
                    break
                case 'W':
                    x--
                    if (isWall(map, x, y)) continue
                    ;[x, y] = makeCornerWalkIfNecessary(map, player, x, y)
                    break
            }
            player.x = x
            player.y = y
        }
    } else {
        player.direction = getDirection(player.direction, instruction)
    }
}

function makeCornerWalkIfNecessary(map, player, x, y) {
    if (!map.get(x + ':' + y)) {
        let newCoordinates
        try {
            newCoordinates = AREA_RULES[getArea(player.x, player.y)][player.direction].getNewCoords(player.x, player.y)
        } catch {
            debugger
        }
        if (!isWall(map, newCoordinates.x, newCoordinates.y)) {
            player.direction = AREA_RULES[getArea(player.x, player.y)][player.direction].newOrientation
            x = newCoordinates.x
            y = newCoordinates.y
        } else {
            x = player.x
            y = player.y
        }
    }
    return [x, y]
}

function isWall(map, x, y) {
    return map.get(x + ':' + y) && map.get(x + ':' + y).value === WALL
}

function getDirection(currDirection, move) {
    let dirs = ['N', 'O', 'S', 'W']
    let index = dirs.indexOf(currDirection)

    index = move === 'R' ? index + 1 : index - 1

    if (index <= -1) {
        return dirs[dirs.length - 1]
    }
    if (index >= dirs.length) {
        return dirs[0]
    }
    return dirs[index]
}
