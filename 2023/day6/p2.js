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

    /**
     * distance = (time - pause) * pause
     * distance = -pause^2 + time * pause
     *
     * General formular:
     * 0 = -pause^2 + time * pause - distance
     *
     * Setting into:
     * y = ax^2 + bx + c
     *
     * with:
     * a = -1
     * b = time
     * c = -distance
     */

    let [resultA, resultB] = quadraticFormular(-1, record.time, -1 * record.distance)

    console.log(Math.floor(resultB) - Math.round(resultA))
})

function quadraticFormular(a, b, c) {
    let resultA = (-1 * b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
    let resultB = (-1 * b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
    return [resultA, resultB]
}
