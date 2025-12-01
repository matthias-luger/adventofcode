const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let current = 50
    let lines = data.split('\r\n')
    let zeroTicks = 0
    for (const line of lines) {
        let [newCurent, newZeroTicks] = move(current, line)
        //console.log('current:', current, 'move:', line, 'zeroTicks this move:', newZeroTicks)
        current = newCurent
        zeroTicks += newZeroTicks
    }
    console.log(zeroTicks)
})

function move(current, movement) {
    let dir = movement[0]
    let dist = parseInt(movement.slice(1))

    let zeroTicks = Math.floor(dist / 100)
    dist = dist % 100

    let newValue = current
    if (dir === 'L') {
        if (newValue >= dist) {
            newValue = newValue - dist
            if (newValue === 0) {
                zeroTicks++
            }
        } else {
            if (newValue !== 0) {
                zeroTicks++
            }
            newValue = 100 - (dist - newValue)
        }
    }
    if (dir === 'R') {
        if (newValue + dist < 100) {
            newValue = newValue + dist
            if (newValue === 0) {
                zeroTicks++
            }
        } else {
            if (newValue !== 0) {
                zeroTicks++
            }
            newValue = newValue + dist - 100
        }
    }

    return [newValue, zeroTicks]
}
