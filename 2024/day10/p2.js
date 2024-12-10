const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let [map, width, height] = buildMap(data)

    let sum = 0
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let position = `${x}:${y}`
            if (map.get(position) === '0') {
                let validPaths = getValidPaths(map, [], position)
                sum += validPaths.length
            }
        }
    }

    console.log(sum)
})

function getValidPaths(map, path, nextPosition) {
    let lastNumber = +map.get(path[path.length - 1])
    let newNumber = +map.get(nextPosition)

    if (!map.has(nextPosition)) {
        return []
    }
    let isNewPath = path.length === 0
    if (!isNewPath && newNumber - lastNumber !== 1) {
        return []
    }
    if (isNewPath && newNumber !== 0) {
        return []
    }

    if (newNumber === 9) {
        return [[...path, nextPosition]]
    }

    let [x, y] = nextPosition.split(':').map(Number)
    let paths = []
    paths.push(...getValidPaths(map, [...path, nextPosition], `${x + 1}:${y}`))
    paths.push(...getValidPaths(map, [...path, nextPosition], `${x - 1}:${y}`))
    paths.push(...getValidPaths(map, [...path, nextPosition], `${x}:${y + 1}`))
    paths.push(...getValidPaths(map, [...path, nextPosition], `${x}:${y - 1}`))
    return paths.filter(p => p.length > 0)
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
