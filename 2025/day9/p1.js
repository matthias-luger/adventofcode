const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n').map(x => x.split(',').map(n => parseInt(n)))

    let biggestArea = 0
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            let [x, y] = lines[i]
            let [x2, y2] = lines[j]
            let area = (Math.abs(x - x2) + 1) * (Math.abs(y - y2) + 1)
            if (area > biggestArea) {
                biggestArea = area
            }
        }
    }
    console.log(biggestArea)
})
