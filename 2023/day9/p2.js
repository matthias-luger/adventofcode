const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let numbers = data.split('\r\n').map(line => line.match(/-*\d+/g).map(number => parseInt(number)))

    let checkSum = 0
    numbers.forEach(line => {
        checkSum += getPreviousNumber(line)
    })
    console.log(checkSum)
})

function getPreviousNumber(originalNumbers) {
    let allNumbers = [originalNumbers]
    let currentNumbers = originalNumbers
    while (!currentNumbers.every(number => number === 0)) {
        currentNumbers = getNumbersBelow(currentNumbers)
        allNumbers.push(currentNumbers)
    }

    for (let i = allNumbers.length - 1; i >= 0; i--) {
        let currentNumbers = allNumbers[i]
        if (i === allNumbers.length - 1) {
            currentNumbers.unshift(0)
            continue
        }
        let numbersBelow = allNumbers[i + 1]

        currentNumbers.unshift(currentNumbers[0] - numbersBelow[0])
    }
    return allNumbers[0][0]
}

function getNumbersBelow(numbers) {
    let nextNumbers = []
    for (let i = 0; i < numbers.length - 1; i++) {
        nextNumbers.push(numbers[i + 1] - numbers[i])
    }
    return nextNumbers
}
