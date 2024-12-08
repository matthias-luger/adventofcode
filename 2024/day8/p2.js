const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let { antennas, width, height } = parseAntennaMap(lines)

    let antinodes = new Set()

    for (const antenna of antennas) {
        for (let i = 0; i < antenna[1].length; i++) {
            const antennaA = antenna[1][i]
            for (let j = i + 1; j < antenna[1].length; j++) {
                const antennaB = antenna[1][j]
                let newAntinodes = calculateAntinodes(antennaA, antennaB, width, height)
                for (const antinode of newAntinodes) {
                    antinodes.add(`${antinode.x},${antinode.y}`)
                }
            }
            antinodes.add(`${antennaA.x},${antennaA.y}`)
        }
    }

    console.log(antinodes.size)
})

function isInField(antinode, width, height) {
    return antinode.x >= 0 && antinode.x < width && antinode.y >= 0 && antinode.y < height
}

function calculateAntinodes(antennaA, antennaB, width, height) {
    let vector = [antennaB.x - antennaA.x, antennaB.y - antennaA.y]
    let antiVector = [-vector[0], -vector[1]]

    let antinodes = []
    let newAntinode = { x: antennaA.x + antiVector[0], y: antennaA.y + antiVector[1] }
    while (isInField(newAntinode, width, height)) {
        antinodes.push(newAntinode)
        newAntinode = { x: newAntinode.x + antiVector[0], y: newAntinode.y + antiVector[1] }
    }

    newAntinode = { x: antennaB.x + vector[0], y: antennaB.y + vector[1] }
    while (isInField(newAntinode, width, height)) {
        antinodes.push(newAntinode)
        newAntinode = { x: newAntinode.x + vector[0], y: newAntinode.y + vector[1] }
    }

    return antinodes
}

function parseAntennaMap(lines) {
    let width = lines[0].length
    let height = lines.length
    let antennas = new Map()
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let char = lines[y][x]
            if (char === '.') continue

            let curr = antennas.get(char) || []
            curr.push({
                x: x,
                y: y
            })
            antennas.set(char, curr)
        }
    }
    return { antennas, width, height }
}
