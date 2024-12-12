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
        sum += field.area * field.corners
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
            { vector: [1, 0], unequalNeightbour: false },
            { vector: [0, 1], unequalNeightbour: false },
            { vector: [-1, 0], unequalNeightbour: false },
            { vector: [0, -1], unequalNeightbour: false }
        ]
        let unequalNeightbours = 0
        let area = 1
        let corners = 0
        for (let neightbourVectorObj of neightbourVectors) {
            const neightbourVector = neightbourVectorObj.vector
            let nextCoords = `${x + neightbourVector[0]}:${y + neightbourVector[1]}`
            if (map.get(nextCoords) !== plantType) {
                unequalNeightbours++
                neightbourVectorObj.unequalNeightbour = true
            } else if (!foundFields.has(nextCoords)) {
                let next = deepSearch(x + neightbourVector[0], y + neightbourVector[1])
                if (next) {
                    corners += next.corners
                    area += next.area
                }
            }
        }
        if (unequalNeightbours === 4) {
            corners += 4
        }
        if (unequalNeightbours === 3) {
            corners += 2
        }
        if (unequalNeightbours === 2) {
            let unequalNeightbourVectors = neightbourVectors.filter(nv => nv.unequalNeightbour)
            if (!isGegenvector(unequalNeightbourVectors[0].vector, unequalNeightbourVectors[1].vector)) {
                corners += 1
            }
            corners += getDiagonalCorners(map, x, y, neightbourVectors)
        }
        if (unequalNeightbours === 1 || unequalNeightbours === 0) {
            corners += getDiagonalCorners(map, x, y, neightbourVectors)
        }

        return { plantType, area, corners }
    }

    return fields
}

function getDiagonalCorners(map, x, y, neightbourVectors) {
    let corners = new Set()
    let equalVectors = neightbourVectors.filter(nv => !nv.unequalNeightbour)
    let plantType = map.get(`${x}:${y}`)
    for (const equalVector of equalVectors) {
        for (const equalVector2 of equalVectors) {
            if (equalVector === equalVector2) {
                continue
            }
            let diagonalVector = addVectors(equalVector2.vector, equalVector.vector)
            if (diagonalVector[0] === 0 || diagonalVector[1] === 0) {
                continue
            }
            let coords = `${x + diagonalVector[0]}:${y + diagonalVector[1]}`
            if (map.get(coords) !== plantType) {
                corners.add(coords)
            }
        }
    }
    return corners.size
}

function isGegenvector(vectorA, vectorB) {
    return vectorA[0] + vectorB[0] === 0 && vectorA[1] + vectorB[1] === 0
}

function addVectors(vectorA, vectorB) {
    return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]]
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
