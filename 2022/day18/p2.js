const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let cubeMap = {}

    let minX = Infinity,
        minY = Infinity,
        minZ = Infinity,
        maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity

    split.forEach(value => {
        let [x, y, z] = value.split(',').map(v => parseInt(v))
        if (z < minZ) {
            minZ = z
        }
        if (z > maxZ) {
            maxZ = z
        }
        if (y < minY) {
            minY = y
        }
        if (y > maxY) {
            maxY = y
        }
        if (x < minX) {
            minX = x
        }
        if (x > maxX) {
            maxX = x
        }
        setCubeInMap(cubeMap, x, y, z)
    })

    let surfaces = 0
    let visited = {}
    let queue = [{ x: minX, y: minY, z: minZ }]
    while (queue.length > 0) {
        let e = queue.shift()
        if (getFromCubeMap(visited, e.x, e.y, e.z)) {
            continue
        }
        if (getFromCubeMap(cubeMap, e.x, e.y, e.z)) {
            continue
        }
        if (e.x < minX - 1 || e.x > maxX + 1 || e.y < minY - 1 || e.y > maxY + 1 || e.z < minZ - 1 || e.z > maxZ + 1) {
            continue
        }
        setCubeInMap(visited, e.x, e.y, e.z)
        surfaces += getSurfaceTouchingCubes(e.x, e.y, e.z, cubeMap)

        queue.push(
            { x: e.x + 1, y: e.y, z: e.z },
            { x: e.x - 1, y: e.y, z: e.z },
            { x: e.x, y: e.y + 1, z: e.z },
            { x: e.x, y: e.y - 1, z: e.z },
            { x: e.x, y: e.y, z: e.z + 1 },
            { x: e.x, y: e.y, z: e.z - 1 }
        )
    }
    console.log(surfaces)
})

function getSurfaceTouchingCubes(x, y, z, cubeMap) {
    let surfaces = 0
    if (getFromCubeMap(cubeMap, x + 1, y, z)) {
        surfaces++
    }
    if (getFromCubeMap(cubeMap, x - 1, y, z)) {
        surfaces++
    }
    if (getFromCubeMap(cubeMap, x, y + 1, z)) {
        surfaces++
    }
    if (getFromCubeMap(cubeMap, x, y - 1, z)) {
        surfaces++
    }
    if (getFromCubeMap(cubeMap, x, y, z + 1)) {
        surfaces++
    }
    if (getFromCubeMap(cubeMap, x, y, z - 1)) {
        surfaces++
    }
    return surfaces
}

function getFromCubeMap(map, x, y, z) {
    return map[x + ':' + y + ':' + z]
}

function setCubeInMap(map, x, y, z) {
    map[x + ':' + y + ':' + z] = true
}
