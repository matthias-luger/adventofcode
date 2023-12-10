const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let map = {}
    let start
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map[`${x}:${y}`] = char
            if (char === 'S') {
                start = [x, y]
            }
        })
    })

    replaceStartCharacter(map, start[0], start[1])
    let pipe = followPipe(start.join(':'), map)
    let pipeSet = new Set(pipe.map(coordinates => coordinates.join(':')))

    let insidePoints = new Set()
    let borderDirection
    for (let y = 0; y < lines.length; y++) {
        let lookupCurrentlyInside = false

        for (let x = 0; x < lines[y].length; x++) {
            if (pipeSet.has(`${x}:${y}`)) {
                let char = map[`${x}:${y}`]
                if (char === '-') {
                    continue
                }
                if (char === '|') {
                    lookupCurrentlyInside = !lookupCurrentlyInside
                }
                if (char === 'J' && borderDirection === 'down') {
                    lookupCurrentlyInside = !lookupCurrentlyInside
                }
                if (char === '7' && borderDirection === 'up') {
                    lookupCurrentlyInside = !lookupCurrentlyInside
                }
                if (char === 'L') {
                    borderDirection = 'up'
                }
                if (char === 'F') {
                    borderDirection = 'down'
                }
                continue
            } else {
                if (!pipeSet.has(`${x}:${y}`) && lookupCurrentlyInside) {
                    insidePoints.add(`${x}:${y}`)
                }
            }
        }
    }

    console.log(insidePoints.size)
})

function followPipe(startPoint, map) {
    let currentCoordinates = startPoint.split(':').map(n => parseInt(n))
    let visitedPoints = new Set()
    let pipe = [currentCoordinates]
    let lastCoordinates = []

    let isFinishedPipe = false

    while (currentCoordinates) {
        visitedPoints.add(currentCoordinates.join(':'))
        let nextCoordinates = getNextPoint(map, currentCoordinates[0], currentCoordinates[1], lastCoordinates[0], lastCoordinates[1])
        lastCoordinates = currentCoordinates
        if (!nextCoordinates) {
            break
        }
        if (visitedPoints.has(nextCoordinates.join(':'))) {
            isFinishedPipe = true
            break
        }
        pipe.push(nextCoordinates)
        currentCoordinates = nextCoordinates
    }
    if (isFinishedPipe) {
        return pipe
    } else {
        return null
    }
}

function getNextPoint(map, x, y, lastX, lastY) {
    let currentChar = map[x + ':' + y]
    let currentCharacter = getCharacterObject(currentChar, x, y)
    if (!currentCharacter) {
        return null
    }

    let nextCoordinates = currentCharacter.directions.find(nextCoordinates => {
        if (lastX === nextCoordinates[0] && lastY === nextCoordinates[1]) {
            return false
        }
        let nextCharacter = getCharacterObject(map[nextCoordinates.join(':')], nextCoordinates[0], nextCoordinates[1])
        if (!nextCharacter) {
            return false
        }
        return areFieldsConnected(x, y, nextCoordinates[0], nextCoordinates[1], currentCharacter, nextCharacter)
    })

    return nextCoordinates
}

function areFieldsConnected(x1, y1, x2, y2, characterObject1, characterObject2) {
    let isObject1Connected = characterObject1.directions.some(direction => {
        return direction[0] === x2 && direction[1] === y2
    })
    let isObject2Connected = characterObject2.directions.some(direction => {
        return direction[0] === x1 && direction[1] === y1
    })
    return isObject1Connected && isObject2Connected
}

function replaceStartCharacter(map, startX, startY) {
    let connectingCoordinates = [
        [startX + 1, startY],
        [startX - 1, startY],
        [startX, startY + 1],
        [startX, startY - 1]
    ]

    let replaceChar
    ;['-', '|', 'J', 'L', 'F', '7'].forEach(char => {
        let charObject = getCharacterObject(char, startX, startY)
        let connectingFields = connectingCoordinates.filter(coordinate => {
            let characterObject2 = getCharacterObject(map[coordinate.join(':')], coordinate[0], coordinate[1])
            if (!characterObject2) return false
            return areFieldsConnected(startX, startY, coordinate[0], coordinate[1], charObject, characterObject2)
        })

        if (connectingFields.length === 2) {
            replaceChar = char
        }
    })
    map[`${startX}:${startY}`] = replaceChar
}

function getCharacterObject(char, x, y) {
    let characters = [
        {
            char: '|',
            directions: [
                [x, y + 1],
                [x, y - 1]
            ]
        },
        {
            char: '-',
            directions: [
                [x + 1, y],
                [x - 1, y]
            ]
        },
        {
            char: 'J',
            directions: [
                [x - 1, y],
                [x, y - 1]
            ]
        },
        {
            char: 'L',
            directions: [
                [x + 1, y],
                [x, y - 1]
            ]
        },
        {
            char: 'F',
            directions: [
                [x + 1, y],
                [x, y + 1]
            ]
        },
        {
            char: '7',
            directions: [
                [x - 1, y],
                [x, y + 1]
            ]
        }
    ]
    return characters.find(character => character.char === char)
}
