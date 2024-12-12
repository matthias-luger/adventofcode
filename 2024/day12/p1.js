const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let [map, width, height] = buildMap(data)
    let fields = parseFields(map, width, height)

    let sum = 0
    for (const field of fields) {
        sum += field.area * field.borders
    }
    console.log(sum)
})

function parseFields(map, width, height) {
    let foundFields = new Set()
    let fields = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let field = deepSearch(x, y)
            if (field) {
                fields.push(field)
            }
        }
    }

    function deepSearch(x, y) {
        if (foundFields.has(`${x}:${y}`)) {
            return null
        }
        let coords = `${x}:${y}`
        if (foundFields.has(coords)) {
            return null
        }
        foundFields.add(coords)
        let plantType = map.get(coords)

        let neightbourVectors = [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1]
        ]
        let borders = 0
        let area = 1
        for (const neightbourVector of neightbourVectors) {
            if (map.get(`${x + neightbourVector[0]}:${y + neightbourVector[1]}`) !== plantType) {
                borders++
            } else if (!foundFields.has(`${x + neightbourVector[0]}:${y + neightbourVector[1]}`)) {
                let next = deepSearch(x + neightbourVector[0], y + neightbourVector[1])
                if (next) {
                    borders += next.borders
                    area += next.area
                }
            }
        }
        return { plantType, area, borders }
    }

    return fields
}

function buildMap(data) {
    let map = new Map()
    let lines = data.split('\r\n')
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
