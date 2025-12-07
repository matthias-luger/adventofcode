const fs = require('fs')

let cache = new Map()

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let { map, startX, startY } = parseMap(lines)
    let possiblePaths = simulateLight(startX, startY, map)
    console.log(possiblePaths)
})

function simulateLight(startX, startY, map) {
    if (cache.has(`${startX},${startY}`)) {
        return cache.get(`${startX},${startY}`)
    }
    let currentX = startX
    let currentY = startY

    let position = map.get(`${currentX},${currentY}`)
    while (position) {
        if (position === '^') {
            let p1 = simulateLight(currentX + 1, currentY, map)
            let p2 = simulateLight(currentX - 1, currentY, map)
            cache.set(`${startX},${startY}`, p1 + p2)
            return p1 + p2
        }
        currentY++
        position = map.get(`${currentX},${currentY}`)
    }
    cache.set(`${startX},${startY}`, 1)
    return 1
}

function parseMap(lines) {
    let map = new Map()
    let startX = 0
    let startY = 0
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            let char = lines[y][x]
            if (char === 'S') {
                startX = x
                startY = y
            }
            map.set(`${x},${y}`, char)
        }
    }
    return { map, startX, startY }
}
