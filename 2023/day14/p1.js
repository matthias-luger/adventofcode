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

    let canStillTiltNorth = true
    while (canStillTiltNorth) {
        canStillTiltNorth = tiltNorth(stones, cubes)
    }

    let checksum = 0
    for (let stone of stones) {
        let [x, y] = stone.split(',').map(Number)
        checksum += lines.length - y
    }

    console.log(checksum)
})

function tiltNorth(stones, cubes) {
    let hasSomeStoneMoved = false
    for (let stone of stones) {
        let [x, y] = stone.split(',').map(Number)
        if (!cubes.has(`${x},${y - 1}`) && !stones.has(`${x},${y - 1}`) && y > 0) {
            stones.delete(stone)
            stones.add(`${x},${y - 1}`)
            hasSomeStoneMoved = true
        }
    }
    return hasSomeStoneMoved
}
