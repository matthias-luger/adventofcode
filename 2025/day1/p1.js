const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let current = 50
    let lines = data.split('\r\n')
    let sum = 0

    for (const line of lines) {
        current = move(current, line)
        //console.log(current)
        if (current === 0) {
            sum++
        }
    }
    console.log(sum)
})

function move(current, movement) {
    let dir = movement[0]
    let dist = parseInt(movement.slice(1)) % 100

    let newValue = current
    if (dir === 'L') {
        if (current >= dist) {
            newValue = current - dist
        } else {
            newValue = 100 - (dist - current)
        }
    }
    if (dir === 'R') {
        if (current + dist < 100) {
            newValue = current + dist
        } else {
            newValue = current + dist - 100
        }
    }

    return newValue
}
