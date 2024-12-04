const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let [map, width, height] = buildMap(data)
    let finds = 0
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (isXMas(map, x, y)) {
                finds++
            }
        }
    }

    console.log(finds)
})

function isXMas(map, x, y) {
    let curr = map.get(`${x}:${y}`)
    if (curr !== 'A') return false
    let topLeft = map.get(`${x - 1}:${y - 1}`)
    let topRight = map.get(`${x + 1}:${y - 1}`)
    let bottomLeft = map.get(`${x - 1}:${y + 1}`)
    let bottomRight = map.get(`${x + 1}:${y + 1}`)

    let leftDiagonal = (topLeft === 'M' && bottomRight === 'S') || (topLeft === 'S' && bottomRight === 'M')
    let rightDiagonal = (topRight === 'M' && bottomLeft === 'S') || (topRight === 'S' && bottomLeft === 'M')
    return leftDiagonal && rightDiagonal
}

function buildMap(data) {
    let map = new Map()
    let lines = data.split('\n')
    let width = lines[0].length
    let height = lines.length

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]
        for (let x = 0; x < line.length; x++) {
            map.set(`${x}:${y}`, line[x])
        }
    }

    return [map, width, height]
}
