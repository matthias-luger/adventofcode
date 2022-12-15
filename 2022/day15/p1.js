const fs = require('fs')
const { addEmptySpaces, paint } = require('./paint')

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

    let Y = 2000000
    let found = {}
    Object.keys(map).forEach(key => {
        let sensor = map[key]
        if (sensor.type !== SENSOR) {
            return
        }

        // for paint
        //addEmptySpaces(map, sensor)

        let match = sensor.distance - Math.abs(sensor.coords.y - Y)

        if (match > 0) {
            for (let x = sensor.coords.x - match; x < sensor.coords.x + match; x++) {
                found[x] = true
            }
        }
    })

    //paint(map)

    console.log(Object.keys(found).length)
})

function getCoords(coords) {
    return {
        x: +coords.split('x=')[1].split(', ')[0],
        y: +coords.split('y=')[1]
    }
}
