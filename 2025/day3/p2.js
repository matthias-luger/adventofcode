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
    let positionsLeft = 12
    let result = []
    while (positionsLeft > 0) {
        let highest = Math.max(...numbers.toSpliced(numbers.length - positionsLeft + 1, positionsLeft + 1))
        let indexOfHighest = numbers.indexOf(highest)
        result.push(highest)
        numbers = numbers.toSpliced(0, indexOfHighest + 1)
        positionsLeft--
    }
    let finalNumber = 0
    for (let i = 0; i < result.length; i++) {
        finalNumber += result[i] * Math.pow(10, result.length - 1 - i)
    }
    return finalNumber
}
