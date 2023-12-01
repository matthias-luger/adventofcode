const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let calibrationNumbersSum = 0

    lines.forEach(line => {
        if (line === '') return

        let numbers = line.match(/(\d)/g)
        let first = numbers[0]
        let last = numbers[numbers.length - 1]

        calibrationNumbersSum += parseInt(`${first}${last}`)
    })

    console.log(calibrationNumbersSum)
})
