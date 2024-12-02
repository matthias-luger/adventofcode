const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let safeLines = 0

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (isValidWithRemoval(line)) {
            safeLines++
        }
    }

    console.log(safeLines)
})

function isValidWithRemoval(line) {
    if (isValid(line)) return true

    let numbers = line.split(' ').map(ch => parseInt(ch))

    for (let i = 0; i < numbers.length; i++) {
        let modifiedNumbers = numbers.slice(0, i).concat(numbers.slice(i + 1))
        if (isValid(modifiedNumbers)) return true
    }
    return false
}

function isValid(numbers) {
    let valid = true
    let direction = numbers[0] > numbers[1] ? 'DESC' : 'ASC'

    for (let j = 1; j < numbers.length; j++) {
        if (direction === 'ASC' && numbers[j - 1] > numbers[j]) {
            valid = false
            break
        }
        if (direction === 'DESC' && numbers[j - 1] < numbers[j]) {
            valid = false
            break
        }

        const stepA = numbers[j - 1]
        const stepB = numbers[j]
        let diff = Math.abs(stepA - stepB)

        if (diff > 3 || diff === 0) {
            valid = false
            break
        }
    }
    return valid
}
