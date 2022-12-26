const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let monkeyMap = new Map()

    lines.forEach(line => {
        let name = line.split(':')[0]
        let split = line.split(' ')
        let getEquasion = function () {
            if (name === 'humn') {
                return 'x'
            }
            if (!isNaN(+split[1])) {
                return +split[1]
            }
            let name1 = split[1]
            let name2 = split[3]
            let operator = name === 'root' ? '=' : split[2]

            let equasionA = monkeyMap.get(name1).getEquasion()
            let equasionB = monkeyMap.get(name2).getEquasion()
            return `(${equasionA.toString().indexOf('x') === -1 ? eval(equasionA) : equasionA}${operator}${
                equasionB.toString().indexOf('x') === -1 ? eval(equasionB) : equasionB
            })`
        }
        monkeyMap.set(name, { getEquasion, getYell: () => eval(getEquasion) })
    })

    let rootEquasion = monkeyMap.get('root').getEquasion()
    let targetNumber
    let equasion

    if (!isNaN(rootEquasion.split('=')[0])) {
        targetNumber = +rootEquasion.split('=')[0].substring(0, rootEquasion.split('=')[1].length - 1)
        equasion = rootEquasion.split('=')[1].substring(1)
    } else {
        targetNumber = +rootEquasion.split('=')[1].substring(0, rootEquasion.split('=')[1].length - 1)
        equasion = rootEquasion.split('=')[0].substring(1)
    }

    let calculation = function (x) {
        return eval(equasion.replace('x', x.toString()))
    }

    let correlation = calculation(1) > calculation(0) ? 1 : -1

    let number = 1
    let lastResult = calculation(number)
    let increment = 100000000000000
    let wasUnderTarget = true
    while (lastResult !== targetNumber) {
        if (lastResult > targetNumber) {
            if (wasUnderTarget) {
                increment /= 10
            }
            wasUnderTarget = false
            number -= increment * correlation
        }
        if (lastResult < targetNumber) {
            if (!wasUnderTarget) {
                increment /= 10
            }
            wasUnderTarget = true
            number += increment * correlation
        }
        lastResult = calculation(number)
    }

    console.log(number)
})
