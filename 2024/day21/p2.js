const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let instructions = data.split('\r\n')
    let { keypad, numKeypad } = init()

    let sum = 0
    for (const instruction of instructions) {
        let r = getShortestTotalPath(numKeypad, 'A', instruction)
        let shortestPath = getShortestPathForLayers(keypad, r, 25)
        sum += shortestPath * parseInt(instruction, 10)
    }

    console.log(sum)
})

function getShortestPathForLayers(map, path, layers) {
    path = 'A' + path
    let stillToGoMap = toPairs(new Map(), path)

    function toPairs(stillToGoMap, path, multiplier = 1) {
        for (let i = 0; i < path.length - 1; i++) {
            let key = `${path[i]}${path[i + 1]}`
            if (stillToGoMap.has(key)) {
                stillToGoMap.set(key, stillToGoMap.get(key) + multiplier)
            } else {
                stillToGoMap.set(key, multiplier)
            }
        }
        return stillToGoMap
    }

    for (let i = 0; i < layers; i++) {
        let stillToGo = new Map()
        for (let key of stillToGoMap.keys()) {
            let count = stillToGoMap.get(key)
            let newPath = key[0] === key[1] ? 'A' : getShortestPath(map, key[0], key[1])
            toPairs(stillToGo, 'A' + newPath, count)
        }
        stillToGoMap = new Map(stillToGo)
    }
    let sum = 0
    for (let value of stillToGoMap.values()) {
        sum += value
    }
    return sum
}

function getShortestTotalPath(map, startingPosition, path) {
    if (path.length === 1) {
        let result = getShortestPath(map, startingPosition, path[0])
        return result
    }
    let result = getShortestTotalPath(map, startingPosition, path[0])
    result += getShortestTotalPath(map, path[0], path.slice(1))
    return result
}

let cache = new Map()
// these priorities are what are the shortest ways from the "A" position on the keypad
const priorities = ['<', 'v', '^', '>']
function getShortestPath(map, startingPosition, targetPosition) {
    let cacheKey = `${startingPosition}-${targetPosition}`
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)
    }

    let targetCoordinates = map.get(targetPosition)
    let queue = [{ current: map.get(startingPosition), path: [], distance: 0 }]
    let visited = new Map()
    let finished = []

    while (queue.length > 0) {
        let { current, path, distance } = queue.shift()
        if (!map.has(current)) {
            continue
        }
        if (visited.has(current) && visited.get(current) < distance) {
            continue
        }
        if (current === targetCoordinates) {
            finished.push({ current, path, distance })
            continue
        }
        visited.set(current, distance)

        let [x, y] = current.split(':').map(Number)
        queue.push({ current: `${x + 1}:${y}`, distance: distance + 1, path: [...path, '>'] })
        queue.push({ current: `${x - 1}:${y}`, distance: distance + 1, path: [...path, '<'] })
        queue.push({ current: `${x}:${y + 1}`, distance: distance + 1, path: [...path, 'v'] })
        queue.push({ current: `${x}:${y - 1}`, distance: distance + 1, path: [...path, '^'] })
    }

    let shortestDistance = finished.sort((a, b) => a.distance - b.distance)[0].distance
    finished = finished.filter(f => f.distance === shortestDistance).map(p => p.path.join(''))

    // find the best path using the priorities and as little switches between directions as possible
    finished.sort((a, b) => {
        let noSwitchesA = 0
        let noSwitchesB = 0
        let lastA = a[0]
        let lastB = b[0]
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== lastA) {
                noSwitchesA++
                lastA = a[i]
            }
            if (b[i] !== lastB) {
                noSwitchesB++
                lastB = b[i]
            }
        }
        if (noSwitchesA === noSwitchesB) {
            for (let i = 0; i < priorities.length; i++) {
                if (a[i] !== b[i]) {
                    return priorities.indexOf(a[i]) - priorities.indexOf(b[i])
                }
            }
            return 0
        }
        return noSwitchesA - noSwitchesB
    })
    let result = finished[0] + 'A'
    cache.set(cacheKey, result)
    return result
}

function init() {
    const numKeypad = new Map()
    const keypad = new Map()

    numKeypad.set('0:0', '7')
    numKeypad.set('1:0', '8')
    numKeypad.set('2:0', '9')
    numKeypad.set('0:1', '4')
    numKeypad.set('1:1', '5')
    numKeypad.set('2:1', '6')
    numKeypad.set('0:2', '1')
    numKeypad.set('1:2', '2')
    numKeypad.set('2:2', '3')
    numKeypad.set('1:3', '0')
    numKeypad.set('2:3', 'A')

    numKeypad.forEach((value, key) => {
        numKeypad.set(value, key)
    })

    keypad.set('1:0', '^')
    keypad.set('2:0', 'A')
    keypad.set('0:1', '<')
    keypad.set('1:1', 'v')
    keypad.set('2:1', '>')

    keypad.forEach((value, key) => {
        keypad.set(value, key)
    })

    return { numKeypad, keypad }
}
