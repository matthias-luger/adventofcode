const fs = require('fs')

const WALL = '#'
const WAY = '.'

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
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
                    map.set(i + ':' + lineNo, value[i] === ' ' ? null : value[i])
                }
            }
        }
        lineNo++
    })

    let x = 0
    while (!map.get(x + ':0')) {
        x++
    }
    player.x = x
    player.y = 0

    for (let i = 0; i < instructions.length; i++) {
        movePlayer(map, player, instructions[i])
        if (player.y === -1) {
            debugger
        }
    }

    console.log(getScore(player))
})

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
                    if (map.get(x + ':' + y) === WALL) {
                        continue
                    }
                    if (!map.get(x + ':' + y)) {
                        do {
                            y++
                        } while (map.get(x + ':' + y))
                        y--
                        if (map.get(x + ':' + y) === WALL) {
                            continue
                        }
                    }
                    break
                case 'O':
                    x++
                    if (map.get(x + ':' + y) === WALL) {
                        continue
                    }
                    if (!map.get(x + ':' + y)) {
                        do {
                            x--
                        } while (map.get(x + ':' + y))
                        x++
                        if (map.get(x + ':' + y) === WALL) {
                            continue
                        }
                    }
                    break
                case 'S':
                    y++
                    if (map.get(x + ':' + y) === WALL) {
                        continue
                    }
                    if (!map.get(x + ':' + y)) {
                        do {
                            y--
                        } while (map.get(x + ':' + y))
                        y++
                        if (map.get(x + ':' + y) === WALL) {
                            continue
                        }
                    }
                    break
                case 'W':
                    x--
                    if (map.get(x + ':' + y) === WALL) {
                        continue
                    }
                    if (!map.get(x + ':' + y)) {
                        do {
                            x++
                        } while (map.get(x + ':' + y))
                        x--
                        if (map.get(x + ':' + y) === WALL) {
                            continue
                        }
                    }
                    break
            }
            player.x = x
            player.y = y
        }
    } else {
        player.direction = getDirection(player.direction, instruction)
    }
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
