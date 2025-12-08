const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let coords = data.split('\r\n')

    let distances = calculateDistances(coords)
    let connectionMap = new Map()

    while (true) {
        let nextShortest = distances.shift()
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

        if (newCircuit.size === coords.length) {
            console.log(+nextShortest.coordsA.split(',')[0] * +nextShortest.coordsB.split(',')[0])
            return
        }
    }
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

let distanceCache = new Map()
function distance(coords1, coords2) {
    if (distanceCache.has(coords1) && distanceCache.get(coords1).has(coords2)) {
        return distanceCache.get(coords1).get(coords2)
    }
    let [x1, y1, z1] = coords1.split(',').map(x => parseInt(x))
    let [x2, y2, z2] = coords2.split(',').map(x => parseInt(x))

    let dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2))

    if (!distanceCache.has(coords1)) {
        distanceCache.set(coords1, new Map())
    }
    if (!distanceCache.has(coords2)) {
        distanceCache.set(coords2, new Map())
    }
    distanceCache.get(coords1).set(coords2, dist)
    distanceCache.get(coords2).set(coords1, dist)

    return dist
}
