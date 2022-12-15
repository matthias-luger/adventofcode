const fs = require('fs')

const BEACON = 'beacon'
const SENSOR = 'sensor'
const EMPTY = 'empty'

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let map = {}
    lines.forEach(line => {
        let sensor = getCoords(line.split('Sensor at ')[1].split(': closest beacon')[0])
        let beacon = getCoords(line.split(': closest beacon is at ')[1])

        map[sensor.x + ':' + sensor.y] = {
            type: SENSOR,
            coords: {
                x: sensor.x,
                y: sensor.y
            },
            beacon: {
                x: beacon.x,
                y: beacon.y
            },
            distance: Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
        }
        map[beacon.x + ':' + beacon.y] = {
            type: BEACON,
            coords: {
                x: beacon.x,
                y: beacon.y
            },
            sensor: {
                x: sensor.x,
                y: sensor.y
            },
            distance: Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
        }
    })

    let endresult = {}
    let SEARCH_RADIUS = 4000000
    for (let y = 0; y < SEARCH_RADIUS; y++) {
        let fromTo = []
        Object.keys(map).forEach(key => {
            let sensor = map[key]
            if (sensor.type !== SENSOR) {
                return
            }

            let match = sensor.distance - Math.abs(sensor.coords.y - y)

            if (match > 0) {
                fromTo.push({ from: sensor.coords.x - match, to: sensor.coords.x + match })
            }
        })

        let didGroup = false
        do {
            if (fromTo.length === 1) {
                didGroup = false
            } else {
                ;[didGroup, fromTo] = group(fromTo)
            }
        } while (didGroup)

        if (fromTo.length >= 2 || fromTo.from > 0 || fromTo.to < SEARCH_RADIUS) {
            // fromTo could include other useless lengths
            while (fromTo.length !== 2) {
                ;[_, fromTo] = group([...fromTo.slice(1, fromTo.length), fromTo[0]])
            }
            fromTo = fromTo.sort((a, b) => a.from - b.from)
            endresult = { x: fromTo[0].to + 1, y }
        }
    }
    console.log(endresult.x * 4_000_000 + endresult.y)
})

function group(fromTo) {
    let a = fromTo[0]
    for (let i = 1; i < fromTo.length; i++) {
        let b = fromTo[i]

        // b in a
        if (b.from >= a.from && b.to <= a.to) {
            fromTo.splice(i, 1)
            return [true, fromTo]
        }
        // a in b
        if (b.from <= a.from && b.to >= a.to) {
            fromTo.splice(0, 1)
            return [true, fromTo]
        }
        // a links,  b rechts
        if (a.from <= b.from && a.to >= b.from - 1) {
            fromTo[i] = {
                from: a.from,
                to: b.to
            }
            fromTo.splice(0, 1)
            return [true, fromTo]
        }
        // b links, a rechts
        if (b.from <= a.from && b.to >= a.from - 1) {
            fromTo[i] = {
                from: b.from,
                to: a.to
            }
            fromTo.splice(0, 1)
            return [true, fromTo]
        }
    }
    return [false, fromTo]
}

function getCoords(coords) {
    return {
        x: +coords.split('x=')[1].split(', ')[0],
        y: +coords.split('y=')[1]
    }
}
