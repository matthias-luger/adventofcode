const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let sum = 0
    for (const line of lines) {
        let highest = getHighestNumber(line)
        sum += highest
    }
    console.log(sum)
})

function getHighestNumber(line) {
    let numbers = line.split('').map(x => parseInt(x))
    let highest = Math.max(...numbers.toSpliced(numbers.length - 1, 1))
    let indexOfHighest = numbers.indexOf(highest)

    let secondHighest = Math.max(...numbers.toSpliced(0, indexOfHighest + 1))
    return highest * 10 + secondHighest
}
