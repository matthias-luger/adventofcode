const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let values = []
    let curr = 0
    split.forEach(value => {
        if (value === '') {
            values.push(curr)
            curr = 0
        }

        curr += +value
    })
    values = values.sort((a, b) => b - a)
    console.log(values[0] + values[1] + values[2])
})
