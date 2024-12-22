const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let sum = 0
    for (const line of lines) {
        let number = parseInt(line)

        for (let i = 0; i < 2000; i++) {
            number = getSecretNumber(number)
        }

        sum += number
    }
    console.log(sum)
})

function getSecretNumber(number) {
    number = mix(number, number * 64)
    number = prune(number)
    number = mix(number, Math.floor(number / 32))
    number = prune(number)
    number = mix(number, number * 2048)
    return prune(number)
}

function mix(a, b) {
    return Number(BigInt(a) ^ BigInt(b))
}

function prune(a) {
    return a % 16777216
}
