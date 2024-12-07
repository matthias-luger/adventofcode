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
        if (isValid(calibration.result, calibration.numbers)) {
            sum += calibration.result
        }
    }
    console.log(sum)
})

function isValid(result, numbers) {
    let variants = getVariants([], numbers.length - 1)
    for (const variant of variants) {
        if (calculate(numbers, variant) === result) {
            return true
        }
    }
}

function getVariants(operators, length) {
    if (length === 0) {
        return [operators]
    }
    let variantsA = getVariants([...operators, '+'], length - 1)
    let variantsB = getVariants([...operators, '*'], length - 1)
    let variantsC = getVariants([...operators, '||'], length - 1)
    return [...variantsA, ...variantsB, ...variantsC]
}

function calculate(numbers, operators) {
    let result = numbers[0]
    for (let i = 1; i < numbers.length; i++) {
        if (operators[i - 1] === '+') {
            result += numbers[i]
        }
        if (operators[i - 1] === '*') {
            result *= numbers[i]
        }
        if (operators[i - 1] === '||') {
            result = +`${result}${numbers[i]}`
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
