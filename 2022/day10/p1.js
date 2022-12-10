const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let cycle = 0
    let x = 1
    let sum = 0

    split.forEach(line => {
        let splits = line.split(' ')
        if (splits[0] === 'addx') {
            cycle++
            sum += checkCycle(cycle, x)
            cycle++
            sum += checkCycle(cycle, x)
            x += +splits[1]
        } else {
            cycle++
            sum += checkCycle(cycle, x)
        }
    })
    console.log(sum)
})

function checkCycle(cycle, x) {
    if ((cycle + 20) % 40 === 0) {
        return cycle * x
    }
    return 0
}
