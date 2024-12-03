const fs = require('fs')

fs.readFile('./sample.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let sum = 0
    const regex = /mul\(\d{1,3},\d{1,3}\)/g
    const instructions = data.match(regex) || []

    for (const instruction of instructions) {
        const [a, b] = instruction.match(/\d{1,3}/g)
        sum += a * b
    }

    console.log(sum)
})
