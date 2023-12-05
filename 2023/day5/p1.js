const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let lines = data.split('\r\n')
    let maps = parseMaps(lines)
    let lowestLocation = Infinity

    let seeds = lines[0].match(/\d+/g).map(n => parseInt(n))

    let currentValue
    seeds.forEach((seed, i) => {
        currentValue = seed

        maps.forEach(map => {
            let value = map.getMappingValue(currentValue)
            currentValue = value
        })
        if (currentValue < lowestLocation) {
            lowestLocation = currentValue
        }
    })

    console.log(lowestLocation)
})

function parseMaps(lines) {
    let maps = []

    let currentMap = {}
    let currentMappings = []

    let numberRegexp = /\d+/g
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i]

        if (line.includes('map:')) {
            currentMap.label = line
            continue
        }

        if (!line || i === lines.length - 1) {
            currentMap.mappings = currentMappings
            maps.push(currentMap)
            currentMap = {}
            currentMappings = []
            continue
        }

        let numbers = line.match(numberRegexp).map(n => parseInt(n))
        let currentMapping = {}
        currentMapping.destination = numbers[0]
        currentMapping.source = numbers[1]
        currentMapping.range = numbers[2]
        currentMappings.push(currentMapping)
    }

    maps.forEach(map => {
        map.getMappingValue = function (value) {
            let correspondingValue = null
            map.mappings.forEach(mapping => {
                if (correspondingValue !== null) return
                let { destination, source, range } = mapping
                if (value >= source && value < source + range) {
                    correspondingValue = destination + (value - source)
                }
            })
            if (correspondingValue === null) return value
            return correspondingValue
        }
    })
    return maps
}
