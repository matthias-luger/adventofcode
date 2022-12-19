const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let cubeMap = {}
    split.forEach(value => {
        cubeMap[value.replaceAll(',', ':')] = true
    })

    let surfaces = 0
    Object.keys(cubeMap).forEach(coord => {
        surfaces += getFreeSurfaces(coord, cubeMap)
    })
    console.log(surfaces)
})

function getFreeSurfaces(coords, cubeMap) {
    let surfaces = 6
    let [x, y, z] = coords.split(':').map(value => parseInt(value))
    if (getFromCubeMap(cubeMap, x + 1, y, z)) {
        surfaces--
    }
    if (getFromCubeMap(cubeMap, x - 1, y, z)) {
        surfaces--
    }
    if (getFromCubeMap(cubeMap, x, y + 1, z)) {
        surfaces--
    }
    if (getFromCubeMap(cubeMap, x, y - 1, z)) {
        surfaces--
    }
    if (getFromCubeMap(cubeMap, x, y, z + 1)) {
        surfaces--
    }
    if (getFromCubeMap(cubeMap, x, y, z - 1)) {
        surfaces--
    }
    return surfaces
}

function getFromCubeMap(map, x, y, z) {
    return map[x + ':' + y + ':' + z]
}
