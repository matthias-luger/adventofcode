const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let hash = string =>
        string.split('').reduce((sum, a) => {
            return ((sum + a.charCodeAt(0)) * 17) % 256
        }, 0)

    let result = data
        .split(',')
        .map(hash)
        .reduce((a, b) => a + b)

    console.log(result)
})
