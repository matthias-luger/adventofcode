const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let instructions = lines[0].split('').map(e => (e === 'R' ? 1 : 0))
    let graph = {}

    for (let i = 0; i < lines.length; i++) {
        if (i < 2) continue
        let split = lines[i].split(' = ')

        let point = split[0]
        let path = split[1].split(', ').map(e => e.replace(/\(|\)/g, ''))
        graph[point] = path
    }

    let current = 'AAA'
    let steps = 0
    while (current !== 'ZZZ') {
        current = graph[current][instructions[steps % instructions.length]]
        steps++
    }
    console.log(steps)
})
