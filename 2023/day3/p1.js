const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n').map(line => line.split(''))
    let checkSum = 0

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]

        let currentNumber = ''
        let currentNumberHasSymbolNear = false
        for (let j = 0; j < line.length; j++) {
            let char = line[j]

            if (!isNaN(char)) {
                currentNumber += char
                if (hasSymboNear(lines, i, j)) {
                    currentNumberHasSymbolNear = true
                }

                if (j === line.length - 1) {
                    if (currentNumberHasSymbolNear && !isNaN(currentNumber)) {
                        checkSum += parseInt(currentNumber)
                    }
                }
            } else {
                if (currentNumberHasSymbolNear && !isNaN(currentNumber)) {
                    checkSum += parseInt(currentNumber)
                }
                currentNumber = ''
                currentNumberHasSymbolNear = false
            }
        }
    }

    console.log(checkSum)
})

function hasSymboNear(lines, y, x) {
    if (y > 0) {
        let ytoCheck = y - 1
        if (isSymbol(lines[ytoCheck][x])) {
            return true
        }
        if (isSymbol(lines[ytoCheck][x + 1])) {
            return true
        }
        if (isSymbol(lines[ytoCheck][x - 1])) {
            return true
        }
    }
    if (y < lines.length - 1) {
        let yToCheck = y + 1
        if (isSymbol(lines[yToCheck][x])) {
            return true
        }
        if (isSymbol(lines[yToCheck][x + 1])) {
            return true
        }
        if (isSymbol(lines[yToCheck][x - 1])) {
            return true
        }
    }

    if (x > 0) {
        let xToCheck = x - 1
        if (isSymbol(lines[y][xToCheck])) {
            return true
        }
    }
    if (x < lines[y].length - 1) {
        let xToCheck = x + 1
        if (isSymbol(lines[y][xToCheck])) {
            return true
        }
    }
    return false
}

function isSymbol(char) {
    return char !== '.' && isNaN(char) && char !== undefined
}
