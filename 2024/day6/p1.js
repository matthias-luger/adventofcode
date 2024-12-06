const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let [map, width, height, current] = buildMap(data)
    let visited = new Set()
    let currentPos = current
    let direction = [0, -1]

    while (map.has(currentPos)) {
        visited.add(currentPos)
        let [x, y] = currentPos.split(':').map(Number)
        let nextPos = `${x + direction[0]}:${y + direction[1]}`
        let next = map.get(nextPos)

        if (next === '#') {
            direction = turnDirectionRight(direction)
        }
        currentPos = [x + direction[0], y + direction[1]].join(':')
    }

    console.log(visited.size)
})

function turnDirectionRight(direction) {
    let [dx, dy] = direction
    return [dy * -1, dx]
}

function buildMap(data) {
    let map = new Map()
    let lines = data.split('\r\n')
    let width = lines[0].length
    let height = lines.length
    let current = '0:0'

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]
        for (let x = 0; x < line.length; x++) {
            if (line[x] === '^') {
                current = `${x}:${y}`
            }
            map.set(`${x}:${y}`, line[x])
        }
    }

    return [map, width, height, current]
}
