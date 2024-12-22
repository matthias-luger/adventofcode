const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let sequenceMap = new Map()
    let start = new Date()

    for (const line of lines) {
        let number = parseInt(line)
        let secret = number % 10
        let last4 = [secret]
        let found = new Set()

        for (let i = 0; i < 2000; i++) {
            number = getSecretNumber(number)
            let newSecret = number % 10
            last4.push(newSecret - secret)
            if (last4.length > 4) {
                last4.shift()
            }
            if (last4.length === 4 && !found.has(last4.toString())) {
                let key = last4.toString()
                found.add(key)
                if (!sequenceMap.has(key)) {
                    sequenceMap.set(key, newSecret)
                } else {
                    sequenceMap.set(key, sequenceMap.get(key) + newSecret)
                }
            }
            secret = newSecret
        }
    }

    let max = 0
    let maxSequence = ''
    for (const [key, value] of sequenceMap) {
        if (value > max) {
            max = value
            maxSequence = key
        }
    }

    console.log(maxSequence)
    console.log(max)
    console.log(`Runtime ${new Date() - start}ms`)
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
