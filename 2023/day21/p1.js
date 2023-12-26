const fs = require('fs')

const MAX_STEPS = 64

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let { map, startingPoint } = parseMap(lines)

    console.log(fill(map, startingPoint, MAX_STEPS))
})

function fill(map, startingPoint, maxSteps) {
    let paths = [{ ...startingPoint, stepsLeft: maxSteps }]
    let possibleEndpositions = new Set()
    let cache = new Set()

    while (paths.length > 0) {
        let path = paths.shift()

        if (path.stepsLeft % 2 === 0) {
            possibleEndpositions.add(`${path.x},${path.y}`)
        }
        if (path.stepsLeft === 0) continue

        let directions = [
            { x: path.x - 1, y: path.y },
            { x: path.x + 1, y: path.y },
            { x: path.x, y: path.y - 1 },
            { x: path.x, y: path.y + 1 }
        ]

        for (let direction of directions) {
            let key = `${direction.x},${direction.y}`
            if (map.get(key) === '#' || map.get(key) === undefined || cache.has(key)) {
                continue
            }
            cache.add(`${key}`)
            paths.push({ ...direction, stepsLeft: path.stepsLeft - 1 })
        }
    }

    return possibleEndpositions.size
}

function parseMap(lines) {
    let startingPoint = null
    let map = new Map()
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        for (let j = 0; j < line.length; j++) {
            let char = line[j]
            if (char === 'S') {
                startingPoint = { x: j, y: i }
            }
            map.set(`${j},${i}`, char)
        }
    }
    return {
        map,
        startingPoint
    }
}
