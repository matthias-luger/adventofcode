const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let lines = data.split('\r\n')
    let times = lines[0].match(/\d+/g)
    let distances = lines[1].match(/\d+/g)

    let record = {
        time: '',
        distance: ''
    }

    times.forEach((time, i) => {
        record.time += time
        record.distance += distances[i]
    })

    let checkSum = 0
    let waysToWin = 0

    for (let i = 1; i < record.time; i++) {
        let distance = (record.time - i) * i
        if (distance > record.distance) {
            waysToWin++
        } else if (waysToWin > 0) {
            // afterwards there are no more ways to win therefore we can skip the rest
            break
        }
    }

    if (checkSum === 0) {
        checkSum = waysToWin
    } else {
        checkSum *= waysToWin
    }

    console.log(checkSum)
})
