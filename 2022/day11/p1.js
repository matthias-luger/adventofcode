const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let monkeys = []
    let currentMonkey = { inspections: 0, items: [] }

    lines.forEach(line => {
        if (line === '') {
            monkeys.push(currentMonkey)
            currentMonkey = { inspections: 0, items: [] }
        }
        currentMonkey = parseMonkey(currentMonkey, line)
    })
    monkeys.push(currentMonkey)

    for (let i = 0; i < 20; i++) {
        simulate(monkeys)
    }

    let ordered = monkeys.sort((a, b) => b.inspections - a.inspections)
    console.log(ordered[0].inspections * ordered[1].inspections)
})

function simulate(monkeys) {
    monkeys.forEach(monkey => {
        monkey.items.forEach((item, i) => {
            monkey.inspections++
            let newValue = Math.floor(monkey.operation(item) / 3)
            if (monkey.test(newValue)) {
                monkeys[monkey.true].items.push(newValue)
            } else {
                monkeys[monkey.false].items.push(newValue)
            }
            monkey.items = []
        })
    })
}

function parseMonkey(currentMonkey, line) {
    if (line.indexOf('Starting items') !== -1) {
        let split = line.split('Starting items:')
        let items = split[1].split(',')
        currentMonkey.items = items.map(item => parseInt(item))
    }
    if (line.indexOf('Operation: new = ') !== -1) {
        let split = line.split('Operation: new = ')
        currentMonkey.operation = function (old) {
            let operation = split[1].replaceAll('old', old)
            return Function(`return ${operation}`)()
        }
    }
    if (line.indexOf('Test: divisible by') !== -1) {
        let split = line.split('Test: divisible by')
        currentMonkey.test = function (value) {
            return value % parseInt(split[1]) === 0
        }
    }
    if (line.indexOf('If true: throw to monkey') !== -1) {
        currentMonkey.true = parseInt(line.split('If true: throw to monkey')[1])
    }
    if (line.indexOf('If false: throw to monkey') !== -1) {
        currentMonkey.false = parseInt(line.split('If false: throw to monkey')[1])
    }
    return currentMonkey
}
