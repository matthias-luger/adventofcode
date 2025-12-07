const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let { map, startX, startY } = parseMap(lines)
    let splits = simulateLights(startX, startY, map)

    //paintMap(map, lines[0].length, lines.length)

    console.log(splits)
})

function simulateLights(startX, startY, map) {
    let splits = 0
    simulateLight(startX, startY, map)
    return splits

    function simulateLight(startX, startY, map) {
        if (map.get(`${startX},${startY}`) === '|') {
            return []
        }
        map.set(`${startX},${startY}`, '|')
        let path = []
        let currentX = startX
        let currentY = startY

        let position = map.get(`${currentX},${currentY}`)
        while (position) {
            if (position === '^') {
                let p1 = simulateLight(currentX + 1, currentY, map)
                let p2 = simulateLight(currentX - 1, currentY, map)
                if (p1.length > 0 || p2.length > 0) {
                    splits++
                    return [path, ...p1, ...p2]
                }
            }
            path.push(`${currentX},${currentY}`)
            map.set(`${currentX},${currentY}`, '|')
            currentY++
            position = map.get(`${currentX},${currentY}`)
        }
        return [path]
    }
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

function paintMap(map, width, height) {
    let output = ''
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            output += map.get(`${x},${y}`) || ' '
        }
        output += '\n'
    }
    console.log(output)
}
