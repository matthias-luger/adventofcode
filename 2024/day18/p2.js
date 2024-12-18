const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    const width = 71
    const height = 71
    let lastPath

    // This simulates the pathes until one is found (only if the new obstacle lies on the path
    /*
    for (let i = 0; i < lines.length; i++) {
        if (lastPath && !lastPath.path.includes(lines[i].split(',').join(':'))) {
            continue
        }

        let map = buildMap(lines, width, height, i)
        ;[lastPath] = findShortestPath(map, '0:0', `${height - 1}:${width - 1}`)

        if (!lastPath) {
            console.log(lines[i])
            return
        }
    }
    */

    // This simulates removes one obstacle at a time and tries to find a path
    // This is faster as there is presumably faster a path than not, therefore you don't need to simulate that many paths
    for (let i = lines.length - 1; i >= 0; i--) {
        let map = buildMap(lines, width, height, i)
        ;[path] = findShortestPath(map, '0:0', `${height - 1}:${width - 1}`)

        if (path) {
            console.log(lines[i + 1])
            return
        }
    }
})

function findShortestPath(map, startingPosition, endPosition) {
    let shortestToPosMap = new Map()
    let paths = [{ path: [], currentPosition: startingPosition, currentScore: 0 }]
    let finished = []
    while (paths.length > 0) {
        let p = paths.shift()
        let { path, currentPosition, currentScore } = p
        let currentField = map.get(currentPosition)
        if (!map.has(currentPosition)) {
            continue
        }
        if (currentField === '#') {
            continue
        }
        if (shortestToPosMap.has(currentPosition)) {
            if (shortestToPosMap.get(currentPosition) <= currentScore) {
                continue
            }
        }
        if (currentPosition == endPosition) {
            finished.push({ path, currentScore, currentPosition })
            return finished
        }

        shortestToPosMap.set(currentPosition, currentScore)
        let [x, y] = currentPosition.split(':').map(Number)
        paths.push({
            path: [...path, currentPosition],
            currentPosition: `${x}:${y - 1}`,
            currentScore: currentScore + 1
        })
        paths.push({
            path: [...path, currentPosition],
            currentPosition: `${x + 1}:${y}`,
            currentScore: currentScore + 1
        })
        paths.push({
            path: [...path, currentPosition],
            currentPosition: `${x}:${y + 1}`,
            currentScore: currentScore + 1
        })
        paths.push({
            path: [...path, currentPosition],
            currentPosition: `${x - 1}:${y}`,
            currentScore: currentScore + 1
        })
    }
    return finished.sort((a, b) => a.currentScore - b.currentScore)
}

function buildMap(lines, width, height, fallingBytes) {
    let map = new Map()
    let obstacles = new Map()

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]
        if (y <= fallingBytes) {
            obstacles.set(line.split(',').join(':'), y)
        }
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (obstacles.has(`${x}:${y}`)) {
                map.set(`${x}:${y}`, '#')
            } else {
                map.set(`${x}:${y}`, '.')
            }
        }
    }

    return map
}
