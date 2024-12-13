const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let machines = parseInput(lines)

    let sum = 0
    for (let machine of machines) {
        let presses = calculatePresses(machine)

        if (Math.round(presses[0]) === presses[0] && Math.round(presses[1]) === presses[1]) {
            sum += presses[0] * 3 + presses[1]
        }
    }
    console.log(sum)
})

/*
    Check the explanation.txt for the math behind the solution
*/
function calculatePresses(machine) {
    let { x: ax, y: ay } = machine.buttonA
    let { x: bx, y: by } = machine.buttonB
    let { x: px, y: py } = machine.prize

    let buttonPressesB = (py * ax - ay * px) / (by * ax - bx * ay)
    let buttonPressesA = (px - buttonPressesB * bx) / ax

    return [buttonPressesA, buttonPressesB]
}

function parseInput(lines) {
    let machines = []
    let currMachine = {}

    for (let line of lines) {
        if (line === '') {
            machines.push(currMachine)
            currMachine = {}
            continue
        }

        let [type, input] = line.split(': ')
        if (type === 'Button A') {
            let x = parseInt(input.split(', ')[0].substring(2))
            let y = parseInt(input.split('Y+')[1])
            currMachine.buttonA = { x, y }
        }
        if (type === 'Button B') {
            let x = parseInt(input.split(', ')[0].substring(2))
            let y = parseInt(input.split('Y+')[1])
            currMachine.buttonB = { x, y }
        }
        if (type === 'Prize') {
            let x = parseInt(input.split(', ')[0].substring(2)) + 10000000000000
            let y = parseInt(input.split('Y=')[1]) + 10000000000000
            currMachine.prize = { x, y }
        }
    }
    machines.push(currMachine)
    return machines
}
