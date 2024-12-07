const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let calibrations = parse(lines)

    let sum = 0
    for (const calibration of calibrations) {
        if (checkForValidVariants(calibration.result, calibration.numbers, [], calibration.numbers.length - 1)) {
            sum += calibration.result
        }
    }
    console.log(sum)
})

function checkForValidVariants(result, numbers, operators, length) {
    if (length === 0) {
        if (calculate(numbers, operators) === result) {
            return true
        }
        return false
    }
    if (calculate(numbers, operators) > result) {
        return false
    }

    let validA = checkForValidVariants(result, numbers, [...operators, '+'], length - 1)
    let validB = checkForValidVariants(result, numbers, [...operators, '*'], length - 1)
    let validC = checkForValidVariants(result, numbers, [...operators, '||'], length - 1)
    return validA || validB || validC
}

function calculate(numbers, operators) {
    let result = numbers[0]
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === '+') {
            result += numbers[i + 1]
        }
        if (operators[i] === '*') {
            result *= numbers[i + 1]
        }
        if (operators[i] === '||') {
            result = +`${result}${numbers[i + 1]}`
        }
    }
    return result
}

function parse(lines) {
    return lines.map(line => {
        let [result, numbers] = line.split(': ')
        return {
            result: +result,
            numbers: numbers.split(' ').map(n => parseInt(n))
        }
    })
}
