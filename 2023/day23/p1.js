const fs = require('fs')
const path = require('path')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let map = parseMap(lines)
    let results = simulatePath(map, '1,0', [lines.length - 2, lines[0].length - 1].join(','))

    results = results.sort((a, b) => {
        return b.path.size - a.path.size
    })

    console.log(results[0].path.size)
})

function simulatePath(map, startPoint, targetPoint) {
    let initialPath = {
        position: startPoint,
        lastPosition: undefined,
        path: new Map()
    }
    let paths = [initialPath]
    let results = []

    while (paths.length > 0) {
        let currentPath = paths.shift()

        let [x, y] = currentPath.position.split(',').map(Number)

        if (currentPath.path.has(currentPath.position)) {
            continue
        }
        if (map.get(currentPath.position) === '#' || map.get(currentPath.position) === undefined) {
            continue
        }
        if (map.get(currentPath.position) !== '.') {
            if (!canGoSlope(currentPath, x, y, map.get(currentPath.position))) {
                continue
            }
        }

        let nextPath = new Map(currentPath.path)
        nextPath.set(currentPath.position, 'O')

        if (currentPath.position === targetPoint) {
            results.push(currentPath)
            continue
        }

        paths.push({
            position: `${x},${y - 1}`,
            lastPosition: currentPath.position,
            path: nextPath
        })
        paths.push({
            position: `${x},${y + 1}`,
            lastPosition: currentPath.position,
            path: nextPath
        })
        paths.push({
            position: `${x - 1},${y}`,
            lastPosition: currentPath.position,
            path: nextPath
        })
        paths.push({
            position: `${x + 1},${y}`,
            lastPosition: currentPath.position,
            path: nextPath
        })
    }
    return results
}

function canGoSlope(path, x, y, slope) {
    let [lastX, lastY] = path.lastPosition.split(',').map(Number)
    switch (slope) {
        case '<':
            return lastX > x
        case '>':
            return lastX < x
        case '^':
            return lastY > y
        case 'v':
            return lastY < y
    }
}

function parseMap(lines) {
    let map = new Map()
    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]
        for (let x = 0; x < line.length; x++) {
            map.set(`${x},${y}`, line[x])
        }
    }
    return map
}

function paint(map, height, width) {
    for (let y = 0; y < height; y++) {
        let line = ''
        for (let x = 0; x < width; x++) {
            line += map.get(`${x},${y}`)
        }
        console.log(line)
    }
}
