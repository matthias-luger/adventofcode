const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let sum = 0
    const regex = /mul\(\d{1,3},\d{1,3}\)/

    while (true) {
        let indexMul = data.match(regex)?.index === undefined ? Number.POSITIVE_INFINITY : data.match(regex).index
        let indexDo = data.match(/do\(\)/)?.index === undefined ? Number.POSITIVE_INFINITY : data.match(/do\(\)/).index
        let indexDont = data.match(/don't\(\)/)?.index === undefined ? Number.POSITIVE_INFINITY : data.match(/don't\(\)/).index

        let use = Math.min(indexMul, indexDo, indexDont)
        if (use == Number.POSITIVE_INFINITY) {
            break
        }

        if (indexMul === use) {
            data = data.slice(use)
            const [a, b] = data.match(/\d{1,3}/g)
            sum += a * b
            data = data.slice(1)
        }
        if (indexDo === use) {
            data = data.slice(use + 4)
        }
        if (indexDont === use) {
            let nextDo = data.match(/do\(\)/)?.index
            if (nextDo === undefined) {
                break
            }
            data = data.slice(nextDo + 4)
        }
    }

    console.log(sum)
})
