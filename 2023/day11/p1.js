const fs = require('fs')

fs.readFile('./sample.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let map = data.split('\r\n')

    let occupiedRows = new Set()
    let occupiedColumns = new Set()

    map.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char !== '.') {
                occupiedRows.add(y)
                occupiedColumns.add(x)
            }
        })
    })

    addExtraRowsAndColumns(map, occupiedRows, occupiedColumns)
    let galaxies = new Array(...getGalaxyCoordinates(map))

    let sum = 0

    galaxies.forEach(galaxyA => {
        galaxies.forEach(galaxyB => {
            if (galaxyA === galaxyB) {
                return
            }
            let [x1, y1] = galaxyA.split(':').map(Number)
            let [x2, y2] = galaxyB.split(':').map(Number)

            sum += Math.abs(x1 - x2) + Math.abs(y1 - y2)
        })
    })

    console.log(sum / 2)
})

function addExtraRowsAndColumns(map, occupiedRows, occupiedColumns) {
    for (let y = map.length - 1; y >= 0; y--) {
        let line = map[y].split('')
        for (let x = line.length - 1; x >= 0; x--) {
            if (!occupiedColumns.has(x)) {
                line.splice(x, 0, '.')
            }
        }
        map[y] = line.join('')
        if (!occupiedRows.has(y)) {
            let newRow = new Array(line.length).fill('.').join('')
            map.splice(y, 0, newRow)
        }
    }
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
