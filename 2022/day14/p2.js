const fs = require('fs')

const STONE = 'stone'
const SAND = 'sand'

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let map = {}

    lines.forEach(line => {
        let split = line.split(' -> ').map(s => s.split(',').map(x => parseInt(x)))
        generateMap(map, split)
    })

    let floorY = getLowestPointOfMap(map) + 2

    let currentMovingSand = [500, 0]
    let totalSand = 0

    let hasNeverMoved = false
    while (!hasNeverMoved) {
        let hasMoved = simulateSand(map, currentMovingSand, floorY)
        if (!hasMoved) {
            setMapValue(map, currentMovingSand[0], currentMovingSand[1], SAND)
            totalSand++
            if (currentMovingSand[1] === 0) {
                hasNeverMoved = true
            }
            currentMovingSand = [500, 0]
        }
    }

    console.log(totalSand)
})

function simulateSand(map, sand, floorY) {
    if (!getMapValue(map, sand[0], sand[1] + 1, floorY)) {
        sand[1]++
        return true
    }
    if (!getMapValue(map, sand[0] - 1, sand[1] + 1, floorY)) {
        sand[1]++
        sand[0]--
        return true
    }
    if (!getMapValue(map, sand[0] + 1, sand[1] + 1, floorY)) {
        sand[1]++
        sand[0]++
        return true
    }
    return false
}

function generateMap(map, instructions) {
    for (let i = 0; i < instructions.length - 1; i++) {
        let a = instructions[i]
        let b = instructions[i + 1]

        if (a[0] !== b[0]) {
            let greater = b[0] > a[0] ? b[0] : a[0]
            let lesser = b[0] > a[0] ? a[0] : b[0]
            for (let x = lesser; x <= greater; x++) {
                setMapValue(map, x, a[1], STONE)
            }
        }
        if (a[1] !== b[1]) {
            let greater = b[1] > a[1] ? b[1] : a[1]
            let lesser = b[1] > a[1] ? a[1] : b[1]
            for (let y = lesser; y <= greater; y++) {
                setMapValue(map, a[0], y, STONE)
            }
        }
    }
}

function setMapValue(map, x, y, value) {
    map[x + ':' + y] = value
}

function getMapValue(map, x, y, floorY) {
    if (y === floorY) {
        return STONE
    }
    return map[x + ':' + y]
}

function getLowestPointOfMap(map) {
    let lowestPoint = 0
    Object.keys(map).forEach(key => {
        let val = parseInt(key.split(':')[1])
        if (lowestPoint < val) {
            lowestPoint = val
        }
    })
    return lowestPoint
}
