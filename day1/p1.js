const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let max = 0
    let curr = 0
    split.forEach(value => {
        if (value === '') {
            if (curr > max) {
                max = curr
            }
            curr = 0
        }

        curr += +value
    })
    console.log(max)
})
