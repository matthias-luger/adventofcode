const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let coords = data.split('\r\n')

    let distances = calculateDistances(coords)
    let connectionMap = new Map()

    for (let i = 0; i < 1000; i++) {
        let nextShortest = distances[i]
        let { coordsA, coordsB } = nextShortest

        if (!connectionMap.has(coordsA)) {
            connectionMap.set(coordsA, new Set([coordsA]))
        }
        if (!connectionMap.has(coordsB)) {
            connectionMap.set(coordsB, new Set([coordsB]))
        }
        let circuitA = connectionMap.get(coordsA)
        let circuitB = connectionMap.get(coordsB)
        let newCircuit = new Set([...circuitA, ...circuitB])

        newCircuit.forEach(coord => {
            connectionMap.set(coord, newCircuit)
        })
    }

    let sum = 1
    let uniqueCircuits = new Set()
    connectionMap.forEach(circuit => {
        uniqueCircuits.add(circuit)
    })
    let orderedLengths = new Array(...uniqueCircuits).map(circuit => circuit.size).sort((a, b) => b - a)
    for (let i = 0; i < 3; i++) {
        sum *= orderedLengths[i]
    }

    console.log(sum)
})

function calculateDistances(coords) {
    let distances = []
    for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            let dist = distance(coords[i], coords[j])
            distances.push({ coordsA: coords[i], coordsB: coords[j], distance: dist })
        }
    }
    return distances.sort((a, b) => a.distance - b.distance)
}

function distance(coords1, coords2) {
    let [x1, y1, z1] = coords1.split(',').map(x => parseInt(x))
    let [x2, y2, z2] = coords2.split(',').map(x => parseInt(x))

    let dist = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)

    return dist
}
