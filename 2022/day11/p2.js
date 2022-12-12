const fs = require('fs')

let overModulo = 1
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

    monkeys.forEach(monkey => {
        overModulo *= monkey.test
    })

    console.log(monkeys)
    for (let i = 0; i < 10000; i++) {
        simulate(monkeys)
    }
    let ordered = monkeys.sort((a, b) => b.inspections - a.inspections)
    console.log(ordered[0].inspections * ordered[1].inspections)
})

function simulate(monkeys) {
    monkeys.forEach(monkey => {
        monkey.items.forEach((item, i) => {
            monkey.inspections++
            let newValue = monkey.operation(item) % overModulo
            if (newValue % monkey.test === 0) {
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
        currentMonkey.test = parseInt(split[1])
    }
    if (line.indexOf('If true: throw to monkey') !== -1) {
        currentMonkey.true = parseInt(line.split('If true: throw to monkey')[1])
    }
    if (line.indexOf('If false: throw to monkey') !== -1) {
        currentMonkey.false = parseInt(line.split('If false: throw to monkey')[1])
    }
    return currentMonkey
}
