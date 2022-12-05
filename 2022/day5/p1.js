const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let lines = data.split('\r\n')
    let ship = parseShip(lines)
    let instructions = parseInstructions(lines)

    instructions.forEach(instruction => {
        executeInstruction(instruction, ship)
    })

    let result = ''
    Object.keys(ship).forEach(key => {
        result += ship[key][ship[key].length - 1]
    })

    console.log(result)
})

function parseShip(lines) {
    let ship = {}
    lines.forEach(line => {
        if (line.indexOf('move') === -1) {
            for (let i = 0; i < line.length; i++) {
                const char = line[i]
                if (char === '[') {
                    let character = line[i + 1]
                    let containerNumber = i / 4
                    if (!ship[containerNumber]) {
                        ship[containerNumber] = []
                    }
                    ship[containerNumber].unshift(character)
                }
            }
        }
    })
    return ship
}

function parseInstructions(lines) {
    let instructions = []
    lines.forEach(line => {
        if (line.indexOf('move') !== -1) {
            let move = parseInt(line.split(' from ')[0].split('move ')[1])
            let from = parseInt(line.split(' to ')[0].split(' from ')[1]) - 1
            let to = parseInt(line.split(' to ')[1]) - 1
            instructions.push({
                move,
                from,
                to
            })
        }
    })
    return instructions
}

function executeInstruction(instruction, ship) {
    for (let i = 0; i < instruction.move; i++) {
        const element = ship[instruction.from].pop()
        ship[instruction.to].push(element)
    }
}
