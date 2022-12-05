const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let count = 0

    split.forEach(value => {
        let numbers = value.split(/,|-/)
        if ((+numbers[0] <= +numbers[2] && +numbers[1] >= numbers[3]) || (+numbers[0] >= +numbers[2] && +numbers[1] <= numbers[3])) {
            count++
        }
    })

    console.log(count)
})
