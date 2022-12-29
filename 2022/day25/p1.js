const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let sum = 0
    lines.forEach(value => {
        sum += decodeToDecimal(value)
    })
    console.log(encodeDecimal(sum))
})

function decodeToDecimal(encoded) {
    let result = 0
    for (let i = encoded.length - 1; i >= 0; i--) {
        let char = encoded[i]
        let factor = 5 ** (encoded.length - i - 1)
        if (char === '-') {
            result -= factor
            continue
        }
        if (char === '=') {
            result -= 2 * factor
            continue
        }
        result += factor * parseInt(char)
    }
    return result
}

function encodeDecimal(number) {
    numberString = number.toString()

    let result = ''
    while (number !== 0) {
        let factor = 5 ** result.length
        let rest = number % 5 ** (result.length + 1)
        switch (rest / factor) {
            case 0:
                result = '0' + result
                break
            case 1:
                result = '1' + result
                number -= factor
                break
            case 2:
                result = '2' + result
                number -= 2 * factor
                break
            case 3:
                result = '=' + result
                number += 2 * factor
                break
            case 4:
                result = '-' + result
                number += factor
                break
        }
    }
    return result
}
