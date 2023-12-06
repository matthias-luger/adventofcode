const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let lines = data.split('\r\n')
    let times = lines[0].match(/\d+/g).map(n => parseInt(n))
    let distances = lines[1].match(/\d+/g).map(n => parseInt(n))

    let records = times.map((time, i) => {
        return {
            time,
            distance: distances[i]
        }
    })

    let checkSum = 0
    records.forEach(record => {
        let waysToWin = 0

        for (let i = 1; i < record.time; i++) {
            let distance = (record.time - i) * i
            if (distance > record.distance) {
                waysToWin++
            }
        }

        if (checkSum === 0) {
            checkSum = waysToWin
        } else {
            checkSum *= waysToWin
        }
    })

    console.log(checkSum)
})
