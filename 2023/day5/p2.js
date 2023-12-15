/**
 * Note that this solution is not optimal. It is just a proof of concept to show that it is possible to use worker threads to speed up the calculation.
 * I implemented the better solution in the python file (p2.py).
 */

const fs = require('fs')
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads')

function runInWorkerThread(seedGroup, i) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
            workerData: { seedGroup, i }
        })

        worker.on('message', message => {
            console.log(`Seed group ${i} completed. Lowest location: ${message}`)
            resolve(message)
        })

        worker.on('error', error => {
            console.error(error)
        })

        worker.on('exit', code => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`)
            }
        })
    })
}

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let lines = data.split('\r\n')
    let maps = parseMaps(lines)

    if (isMainThread) {
        let startDate = new Date()
        console.log('Start: ' + startDate.toLocaleString())
        console.log('----------------------------------')
        let lowestLocation = Infinity
        let seedGroups = lines[0].match(/\d+ \d+/g).map(n => {
            let numbers = n.match(/\d+/g).map(n => parseInt(n))
            return {
                from: numbers[0],
                range: numbers[1]
            }
        })

        let promises = []
        seedGroups.forEach((seedGroup, i) => {
            promises.push(
                runInWorkerThread(seedGroup, i).then(newLowest => {
                    if (newLowest < lowestLocation) {
                        lowestLocation = newLowest
                    }
                })
            )
        })
        Promise.all(promises).then(() => {
            console.log('----------------------------------')
            console.log('Result: ' + lowestLocation)
            console.log('End: ' + new Date().toLocaleString())
            console.log('Duration: ' + Math.round((new Date() - startDate) / 1000) + ' seconds')
        })
    } else {
        const { seedGroup, i } = workerData

        console.log(`Started working on Seed group ${i}`)
        let lowestLocation = Infinity

        for (let seedNumber = seedGroup.from; seedNumber < seedGroup.from + seedGroup.range; seedNumber++) {
            let currentValue = seedNumber

            maps.forEach(map => {
                let value = map.getMappingValue(currentValue)
                currentValue = value
            })

            if (currentValue < lowestLocation) {
                lowestLocation = currentValue
            }
        }
        parentPort.postMessage(lowestLocation)
    }
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
