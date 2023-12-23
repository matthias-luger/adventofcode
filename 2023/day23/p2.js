const fs = require('fs')

fs.readFile('./sample.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let map = parseMap(lines)

    let start = '1,0'
    let end = [lines.length - 2, lines[0].length - 1].join(',')

    let graph = getGraph(map, start, end)

    console.log(findLongestPath(graph, start, end))

    let erg = {}
    Object.entries(graph).forEach(([key, value]) => {
        let [x, y] = key.split(',').map(Number)
        erg[`${y},${x}`] = []
        Object.entries(value).forEach(([key2, value2]) => {
            let [x2, y2] = key2.split(',').map(Number)
            erg[`${y},${x}`].push([`${y2},${x2}`, value2])
        })
    })
    console.log(erg)
})

function findLongestPath(graph, start, end) {
    const visited = new Set()

    function _findLongestPath(currentNode, currentPathLength) {
        if (currentNode === end) {
            return currentPathLength
        }

        visited.add(currentNode)

        let longestPath = 0

        for (const neighbor in graph[currentNode]) {
            if (!visited.has(neighbor)) {
                const newPathLength = currentPathLength + graph[currentNode][neighbor]
                const pathLength = _findLongestPath(neighbor, newPathLength)
                longestPath = Math.max(longestPath, pathLength)
            }
        }

        visited.delete(currentNode)

        return longestPath
    }

    return _findLongestPath(start, 0)
}

function getGraph(map, startPoint, targetPoint) {
    let initialPath = {
        position: startPoint,
        lastIntersection: startPoint,
        distance: []
    }
    let visited = new Set()
    let graph = {}
    graph[startPoint] = {}

    let paths = [initialPath]

    while (paths.length > 0) {
        let currentPath = paths.pop()

        if (currentPath.position === targetPoint) {
            graph[currentPath.lastIntersection][currentPath.position] = currentPath.distance.length
            continue
        }

        paths.push(...getNextPaths(map, currentPath, graph, visited))
    }
    return graph
}

function getNextPaths(map, currentPath, graph, visited) {
    visited.add(currentPath.position)

    let [x, y] = currentPath.position.split(',').map(Number)

    let possiblePositions = [`${x},${y - 1}`, `${x},${y + 1}`, `${x - 1},${y}`, `${x + 1},${y}`]
    let paths = []

    for (let possiblePosition of possiblePositions) {
        if (map.get(possiblePosition) === '#' || map.get(possiblePosition) === undefined) {
            continue
        }
        if (visited.has(possiblePosition)) {
            if (Object.keys(graph).includes(possiblePosition) && possiblePosition !== currentPath.lastIntersection) {
                graph[currentPath.lastIntersection][possiblePosition] = currentPath.distance.length + 1
                graph[possiblePosition][currentPath.lastIntersection] = currentPath.distance.length + 1
            }
            continue
        }
        paths.push({
            position: possiblePosition,
            distance: [...currentPath.distance, currentPath.position],
            lastIntersection: currentPath.lastIntersection
        })
    }

    if (paths.length > 1) {
        if (!graph[currentPath.position]) {
            graph[currentPath.position] = {}
        }
        graph[currentPath.lastIntersection][currentPath.position] = currentPath.distance.length
        graph[currentPath.position][currentPath.lastIntersection] = currentPath.distance.length
        paths.forEach(path => {
            path.lastIntersection = currentPath.position
            path.distance = [currentPath.position]
        })
    }

    return paths
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
