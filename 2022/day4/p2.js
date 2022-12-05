const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let count = 0

    split.forEach(value => {
        let numbers = value.split(/,|-/).map(v => parseInt(v))
        if (checkIntersect(...numbers)) {
            count++
        }
    })

    console.log(count)
})

function checkIntersect(a, b, c, d) {
    function _check(a, b, c, d) {
        return (c >= a && c <= b) || (d >= a && d <= b)
    }
    return _check(a, b, c, d) || _check(c, d, a, b)
}
