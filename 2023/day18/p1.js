const fs = require('fs')

fs.readFile('./input.txt', 'utf8', async (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let instructions = parseInstructions(data.split('\r\n'))

    let border = new Map()
    let position = { x: 0, y: 0 }
    border.set(`0,0`, '#')
    let maxHeight = 0
    let maxWidth = 0
    let minHeight = Infinity
    let minWidth = Infinity

    for (const instruction of instructions) {
        for (let i = 0; i < instruction.amount; i++) {
            position.x += instruction.direction[0]
            position.y += instruction.direction[1]

            if (position.x > maxWidth) {
                maxWidth = position.x
            }
            if (position.x < minWidth) {
                minWidth = position.x
            }
            if (position.y > maxHeight) {
                maxHeight = position.y
            }
            if (position.y < minHeight) {
                minHeight = position.y
            }

            border.set(`${position.x},${position.y}`, '#')
        }
    }

    let inside = fillInside(border, 1, 1)
    paint(inside, border, minWidth, minHeight, maxWidth, maxHeight)

    console.log(inside.size + border.size)
})

function fillInside(borderMap, x, y) {
    let visited = new Map()
    let queue = [`${x},${y}`]
    while (queue.length > 0) {
        let key = queue.shift()

        if (visited.has(key)) continue
        if (borderMap.has(key)) continue
        let [x, y] = key.split(',').map(Number)

        visited.set(key, ' ')
        queue.push(`${x + 1},${y}`)
        queue.push(`${x - 1},${y}`)
        queue.push(`${x},${y + 1}`)
        queue.push(`${x},${y - 1}`)
    }
    return visited
}

function parseInstructions(lines) {
    let result = []
    const directionChars = {
        U: [0, -1],
        R: [1, 0],
        D: [0, 1],
        L: [-1, 0]
    }
    for (const line of lines) {
        let [direction, amount] = line.split(' ')
        result.push({
            direction: directionChars[direction],
            amount
        })
    }
    return result
}

function paint(map, outside, minWidth, minHeight, width, height) {
    let result = ''
    for (let y = minHeight; y < height; y++) {
        let line = ''
        for (let x = minWidth; x < width; x++) {
            if (x === 0 && y === 0) {
                line += 'X'
                continue
            }

            let val = map.get(`${x},${y}`)
            let val2 = outside.get(`${x},${y}`)

            if (val2) {
                line += val2
            } else if (val) {
                line += val
            } else {
                line += '.'
            }
        }
        console.log(line)
    }
    return result
}
