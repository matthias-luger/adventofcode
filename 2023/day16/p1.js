const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let map = new Map()

    lines.forEach((line, y) => {
        let chars = line.split('')
        chars.forEach((char, x) => {
            map.set(`${x},${y}`, {
                char: char,
                energized: false
            })
        })
    })

    let currentLight = {
        x: 0,
        y: 0,
        direction: 'east'
    }
    calculateLightbeam(currentLight, map)

    let sum = 0
    for (let tile of map.values()) {
        if (tile.energized) {
            sum++
        }
    }
    console.log(sum)
})

let visited = new Set()
function calculateLightbeam(startingLight, map) {
    let currentLight = startingLight

    while (!visited.has(`${currentLight.x},${currentLight.y}:${currentLight.direction}`) && map.get(`${currentLight.x},${currentLight.y}`) !== undefined) {
        visited.add(`${currentLight.x},${currentLight.y}:${currentLight.direction}`)
        map.get(`${currentLight.x},${currentLight.y}`).energized = true
        let currentTile = map.get(`${currentLight.x},${currentLight.y}`)

        let nextX, nextY, nextDirection

        if (currentTile.char === '.') {
            ;[nextX, nextY] = getNextCooridnate(currentLight.x, currentLight.y, currentLight.direction)
            nextDirection = currentLight.direction
        }
        if (currentTile.char === '/') {
            if (currentLight.direction === 'east' || currentLight.direction === 'west') {
                nextDirection = getDirectionToTheLeft(currentLight.direction)
            }
            if (currentLight.direction === 'north' || currentLight.direction === 'south') {
                nextDirection = getDirectionToTheRight(currentLight.direction)
            }
            ;[nextX, nextY] = getNextCooridnate(currentLight.x, currentLight.y, nextDirection)
        }
        if (currentTile.char === '\\') {
            if (currentLight.direction === 'east' || currentLight.direction === 'west') {
                nextDirection = getDirectionToTheRight(currentLight.direction)
            }
            if (currentLight.direction === 'north' || currentLight.direction === 'south') {
                nextDirection = getDirectionToTheLeft(currentLight.direction)
            }
            ;[nextX, nextY] = getNextCooridnate(currentLight.x, currentLight.y, nextDirection)
        }
        if (currentTile.char === '|') {
            if (currentLight.direction === 'east' || currentLight.direction === 'west') {
                let direction1 = getDirectionToTheLeft(currentLight.direction)
                let direction2 = getDirectionToTheRight(currentLight.direction)
                let [x1, y1] = getNextCooridnate(currentLight.x, currentLight.y, direction1)
                let [x2, y2] = getNextCooridnate(currentLight.x, currentLight.y, direction2)
                calculateLightbeam({ x: x1, y: y1, direction: direction1 }, map)
                calculateLightbeam({ x: x2, y: y2, direction: direction2 }, map)
            } else {
                ;[nextX, nextY] = getNextCooridnate(currentLight.x, currentLight.y, currentLight.direction)
                nextDirection = currentLight.direction
            }
        }
        if (currentTile.char === '-') {
            if (currentLight.direction === 'north' || currentLight.direction === 'south') {
                let direction1 = getDirectionToTheLeft(currentLight.direction)
                let direction2 = getDirectionToTheRight(currentLight.direction)
                let [x1, y1] = getNextCooridnate(currentLight.x, currentLight.y, direction1)
                let [x2, y2] = getNextCooridnate(currentLight.x, currentLight.y, direction2)
                calculateLightbeam({ x: x1, y: y1, direction: direction1 }, map)
                calculateLightbeam({ x: x2, y: y2, direction: direction2 }, map)
            } else {
                ;[nextX, nextY] = getNextCooridnate(currentLight.x, currentLight.y, currentLight.direction)
                nextDirection = currentLight.direction
            }
        }

        currentLight.x = nextX
        currentLight.y = nextY
        currentLight.direction = nextDirection
    }
}

function getNextCooridnate(x, y, direction) {
    switch (direction) {
        case 'east':
            return [x + 1, y]
        case 'west':
            return [x - 1, y]
        case 'north':
            return [x, y - 1]
        case 'south':
            return [x, y + 1]
    }
}

function getDirectionToTheRight(direction) {
    switch (direction) {
        case 'east':
            return 'south'
        case 'west':
            return 'north'
        case 'north':
            return 'east'
        case 'south':
            return 'west'
    }
}

function getDirectionToTheLeft(direction) {
    switch (direction) {
        case 'east':
            return 'north'
        case 'west':
            return 'south'
        case 'north':
            return 'west'
        case 'south':
            return 'east'
    }
}

function paint(map, height, width) {
    for (let y = 0; y < height; y++) {
        let row = ''
        for (let x = 0; x < width; x++) {
            if (map.get(`${x},${y}`).energized) {
                row += '#'
            } else {
                row += '.'
            }
        }
        console.log(row)
    }
}
