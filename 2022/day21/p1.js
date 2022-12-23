const fs = require('fs')

fs.readFile('./sample.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    split.forEach(value => {})
})
