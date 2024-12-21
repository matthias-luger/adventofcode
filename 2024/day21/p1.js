const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let instructions = data.split('\r\n')
    let { keypad, numKeypad } = init()

    let results = []
    for (const instruction of instructions) {
        let pathsA = getShortestTotalPaths(numKeypad, 'A', instruction)
        let shortestA = Infinity
        let shortestResultsA = []
        for (const pathA of pathsA) {
            let shortestAPaths = getShortestTotalPaths(keypad, 'A', pathA)
            shortestAPaths.forEach(p => {
                if (p.length <= shortestA) {
                    shortestA = p.length
                }
            })
            shortestResultsA.push(...shortestAPaths)
            shortestResultsA = shortestResultsA.filter(p => p.length <= shortestA)
        }
        let shortestB = Infinity
        let shortestResultsB = []
        for (const pathB of shortestResultsA) {
            let shortestBPaths = getShortestTotalPaths(keypad, 'A', pathB)
            shortestBPaths.forEach(p => {
                if (p.length <= shortestB) {
                    shortestB = p.length
                }
            })
            shortestResultsB.push(...shortestBPaths)
            shortestResultsB = shortestResultsB.filter(p => p.length <= shortestB)
        }
        results.push(shortestResultsB[0])
    }

    let sum = 0
    for (let i = 0; i < results.length; i++) {
        let result = results[i]
        console.log(result)
        let instruction = instructions[i]
        let numericPart = ''
        for (const char of instruction) {
            if (!isNaN(char)) {
                numericPart += char
            }
        }
        sum += result.length * parseInt(numericPart)
    }
    console.log(sum)
})

function getShortestTotalPaths(map, initialPosition, path) {
    let currentPos = map.get(initialPosition)
    let resultPaths = []
    for (const pathEntry of path) {
        let nextPaths = getShortestPaths(map, currentPos, map.get(pathEntry))

        if (resultPaths.length > 0) {
            let newResultPaths = []
            for (const resultPath of resultPaths) {
                for (const nextPath of nextPaths) {
                    newResultPaths.push(resultPath + nextPath + 'A')
                }
            }
            resultPaths = newResultPaths
        } else {
            resultPaths.push(...nextPaths.map(p => p + 'A'))
        }
        currentPos = map.get(pathEntry)
    }
    return resultPaths
}

function getShortestPaths(map, initialPosition, targetPosition) {
    let queue = [{ current: initialPosition, path: [], distance: 0 }]
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
        if (current === targetPosition) {
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
    return finished.filter(f => f.distance === shortestDistance).map(p => p.path.join(''))
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
