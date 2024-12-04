const fs = require('fs')

const TO_FIND = 'XMAS'

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let [map, width, height] = buildMap(data)
    let finds = 0
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            finds += search(map, x, y, 0, 0, 0)
        }
    }

    console.log(finds)
})

function search(map, x, y, dx, dy, step) {
    let finds = 0
    let curr = map.get(`${x}:${y}`)
    if (step === 0) {
        if (curr !== TO_FIND[0]) return 0
        finds += search(map, x + 1, y, 1, 0, 1)
        finds += search(map, x - 1, y, -1, 0, 1)
        finds += search(map, x, y + 1, 0, 1, 1)
        finds += search(map, x, y - 1, 0, -1, 1)
        finds += search(map, x + 1, y + 1, 1, 1, 1)
        finds += search(map, x + 1, y - 1, 1, -1, 1)
        finds += search(map, x - 1, y + 1, -1, 1, 1)
        finds += search(map, x - 1, y - 1, -1, -1, 1)
        return finds
    } else {
        if (curr !== TO_FIND[step]) return 0
        if (step === TO_FIND.length - 1) return 1
        return search(map, x + dx, y + dy, dx, dy, step + 1)
    }
}

function buildMap(data) {
    let map = new Map()
    let lines = data.split('\n')
    let width = lines[0].length
    let height = lines.length

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y]
        for (let x = 0; x < line.length; x++) {
            map.set(`${x}:${y}`, line[x])
        }
    }

    return [map, width, height]
}
