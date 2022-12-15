const BEACON = 'beacon'
const SENSOR = 'sensor'
const EMPTY = 'empty'

module.exports = {
    paint: function (map) {
        let minX = Infinity
        let maxX = -Infinity
        let minY = Infinity
        let maxY = -Infinity
        Object.keys(map).forEach(key => {
            let x = parseInt(key.split(':')[0])
            let y = parseInt(key.split(':')[1])

            if (x < minX) {
                minX = x
            }
            if (x > maxX) {
                maxX = x
            }
            if (y < minY) {
                minY = y
            }
            if (y > maxY) {
                maxY = y
            }
        })

        for (let y = minY; y < maxY; y++) {
            let line = ''
            for (let x = minX; x < maxX; x++) {
                let pos = map[x + ':' + y]
                if (!pos) {
                    line += '.'
                } else {
                    if (pos.type === BEACON) {
                        line += 'B'
                    }
                    if (pos.type === SENSOR) {
                        line += 'S'
                    }
                    if (pos.type === EMPTY) {
                        line += '#'
                    }
                }
            }
            console.log(line)
        }
    },
    addEmptySpaces: function (map, sensor) {
        let distance = Math.abs(sensor.coords.x - sensor.beacon.x) + Math.abs(sensor.coords.y - sensor.beacon.y)
        for (let y = sensor.coords.y - distance; y < sensor.coords.y + distance; y++) {
            let amount = distance - Math.abs(sensor.coords.y - y) + 1
            for (let x = sensor.coords.x - amount + 1; x < sensor.coords.x + amount; x++) {
                if (!map[x + ':' + y]) {
                    map[x + ':' + y] = {
                        type: EMPTY
                    }
                }
            }
        }
    }
}
