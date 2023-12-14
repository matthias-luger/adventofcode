const fs = require('fs')

let height
let width

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    height = lines.length
    width = lines[0].length

    let stones = new Set()
    let cubes = new Set()

    lines.forEach((line, y) => {
        let stonesMatches = line.matchAll(/O/g)
        let cubesMatches = line.matchAll(/#/g)

        for (let stone of stonesMatches) {
            stones.add(`${stone.index},${y}`)
        }
        for (let cube of cubesMatches) {
            cubes.add(`${cube.index},${y}`)
        }
    })

    let uniqueStones = new Map()
    let cycleSize = 0
    let beforeCycle = 0

    let i = 0
    spinAround(stones, cubes)
    while (true) {
        uniqueStones.set(JSON.stringify(Array.from(stones)), i)
        i++
        spinAround(stones, cubes)
        let current = JSON.stringify(Array.from(stones))
        if (uniqueStones.has(current)) {
            cycleSize = uniqueStones.size - uniqueStones.get(current)
            beforeCycle = uniqueStones.size - cycleSize
            break
        }
    }

    let target = 1_000_000_000
    let remaining = (target - beforeCycle) % cycleSize

    for (let i = 0; i < remaining - 1; i++) {
        spinAround(stones, cubes)
    }

    console.log(getPoints(stones, lines.length))
})

function getPoints(stones, height) {
    let checksum = 0
    for (let stone of stones) {
        let [x, y] = stone.split(',').map(Number)
        checksum += height - y
    }
    return checksum
}

function spinAround(stones, cubes) {
    let tilts = [
        [0, -1],
        [-1, 0],
        [0, 1],
        [1, 0]
    ]

    for (let i = 0; i < tilts.length; i++) {
        const tilt = tilts[i]

        for (let stone of stones) {
            let [x, y] = stone.split(',').map(Number)
            let canMove = true
            while (canMove) {
                let newStone = moveStone(x, y, stones, cubes, tilt)
                if (!newStone) {
                    canMove = false
                } else {
                    ;[x, y] = newStone
                }
            }
        }
    }
}

function moveStone(x, y, stones, cubes, tilt) {
    let newX = x + tilt[0]
    let newY = y + tilt[1]
    if (newY < 0 || newX < 0 || newX > width - 1 || newY > height - 1 || cubes.has(`${newX},${newY}`)) {
        return false
    }
    if (stones.has(`${newX},${newY}`)) {
        let moved = moveStone(newX, newY, stones, cubes, tilt)
        if (!moved) {
            return false
        }
    }
    stones.delete(`${x},${y}`)
    stones.add(`${newX},${newY}`)

    return [newX, newY]
}
