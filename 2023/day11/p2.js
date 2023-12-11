const fs = require('fs')

const GALAXY_INCREASE = 1_000_000

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let map = data.split('\r\n')

    let occupiedRows = new Set()
    let occupiedColumns = new Set()
    let galaxies = getGalaxyCoordinates(map)

    map.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char !== '.') {
                occupiedRows.add(y)
                occupiedColumns.add(x)
            }
        })
    })

    let { unoccupiedColumns, unoccupiedRows } = getUnoccupiedLines(map, occupiedColumns, occupiedRows)

    galaxies = addExtraRowsAndColumns(galaxies, unoccupiedRows, unoccupiedColumns)

    let sum = 0

    for (const galaxyA of galaxies) {
        for (const galaxyB of galaxies) {
            if (galaxyA === galaxyB) {
                continue
            }
            let [x1, y1] = galaxyA.split(':').map(Number)
            let [x2, y2] = galaxyB.split(':').map(Number)

            sum += Math.abs(x1 - x2) + Math.abs(y1 - y2)
        }
    }

    console.log(sum / 2)
})

function addExtraRowsAndColumns(galaxies, unoccupiedRows, unoccupiedColumns) {
    let newGalaxies = new Set()
    for (const galaxy of galaxies) {
        let [x, y] = galaxy.split(':').map(Number)
        let newX = x
        let newY = y

        for (const unoccupiedRow of unoccupiedRows) {
            if (y > unoccupiedRow) {
                newY += GALAXY_INCREASE - 1
            }
        }
        for (const unoccupiedColumn of unoccupiedColumns) {
            if (x > unoccupiedColumn) {
                newX += GALAXY_INCREASE - 1
            }
        }
        newGalaxies.add(`${newX}:${newY}`)
    }
    return newGalaxies
}

function getUnoccupiedLines(map, occupiedColumns, occupiedRows) {
    let unoccupiedRows = new Set()
    let unoccupiedColumns = new Set()

    for (let y = 0; y < map.length; y++) {
        if (!occupiedRows.has(y)) {
            unoccupiedRows.add(y)
        }
    }
    for (let x = 0; x < map[0].length; x++) {
        if (!occupiedColumns.has(x)) {
            unoccupiedColumns.add(x)
        }
    }
    return { unoccupiedColumns, unoccupiedRows }
}

function getGalaxyCoordinates(map) {
    let glaxySet = new Set()
    map.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char === '#') {
                glaxySet.add(`${x}:${y}`)
            }
        })
    })
    return glaxySet
}
