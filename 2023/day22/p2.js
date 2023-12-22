const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let cubes = data
        .split('\r\n')
        .map(parseCube)
        .map((cube, i) => {
            cube.id = i
            cube.letter = String.fromCharCode(65 + i)
            return cube
        })

    let sortedCubes = cubes
        .sort((a, b) => a.highZ - b.highZ)
        .map((cube, i) => {
            cube.supports = []
            cube.supportedBy = []
            return cube
        })

    for (let i = 0; i < cubes.length; i++) {
        let currentCube = cubes[i]
        letCubeFall(sortedCubes, currentCube)
    }

    let sum = 0
    for (let i = 0; i < cubes.length; i++) {
        let fallen = new Set()
        fallen.add(cubes[i].letter)
        fillFallenBricks(cubes[i], fallen)
        sum += fallen.size - 1
    }
    console.log(sum)
})

function fillFallenBricks(cube, fallen) {
    if (cube.supportedBy.filter(support => !fallen.has(support.letter)).length === 0) {
        fallen.add(cube.letter)
    }
    cube.supports.forEach(s => {
        fillFallenBricks(s, fallen)
    })
}

function letCubeFall(sortedCubes, cube) {
    for (let i = cube.sortedIndex - 1; i >= 0; i--) {
        let bottomCube = sortedCubes[i]

        let distance = cube.lowZ - bottomCube.highZ
        let fallingDistance = distance - 1

        if (fallingDistance > 0) {
            cube.cornerA.z -= fallingDistance
            cube.cornerB.z -= fallingDistance
            cube.lowZ -= fallingDistance
            cube.highZ -= fallingDistance
        }

        if (isCubeLayingOnTop(cube, bottomCube)) {
            sortedCubes = sortedCubes
                .sort((a, b) => a.highZ - b.highZ)
                .map((cube, i) => {
                    cube.sortedIndex = i
                    return cube
                })
            bottomCube.supports.push(cube)
            cube.supportedBy.push(bottomCube)

            // find more cubes that support this cube
            for (let j = i - 1; j >= 0; j--) {
                let c = sortedCubes[j]
                if (c.highZ !== bottomCube.highZ) break
                if (isCubeLayingOnTop(cube, c)) {
                    c.supports.push(cube)
                    cube.supportedBy.push(c)
                }
            }

            return bottomCube.highZ + 1
        }
    }

    // Fall to the grounds
    let fallingDistance = cube.lowZ - 1

    if (fallingDistance > 0) {
        cube.cornerA.z -= fallingDistance
        cube.cornerB.z -= fallingDistance
        cube.lowZ -= fallingDistance
        cube.highZ -= fallingDistance
    }

    sortedCubes = sortedCubes
        .sort((a, b) => a.highZ - b.highZ)
        .map((cube, i) => {
            cube.sortedIndex = i
            return cube
        })
}

function parseCube(line) {
    let [cornerA, cornerB] = line.split('~')

    let [x1, y1, z1] = cornerA.split(',').map(Number)
    let [x2, y2, z2] = cornerB.split(',').map(Number)
    return {
        cornerA: { x: x1, y: y1, z: z1 },
        cornerB: { x: x2, y: y2, z: z2 },
        highZ: Math.max(z1, z2),
        lowZ: Math.min(z1, z2)
    }
}
function isCubeLayingOnTop(topCube, bottomCube) {
    let xIntersect = isLineIntersecting({ start: topCube.cornerA.x, end: topCube.cornerB.x }, { start: bottomCube.cornerA.x, end: bottomCube.cornerB.x })
    let yIntersect = isLineIntersecting({ start: topCube.cornerA.y, end: topCube.cornerB.y }, { start: bottomCube.cornerA.y, end: bottomCube.cornerB.y })

    let isOneUnitHigher = topCube.lowZ - 1 === bottomCube.highZ

    return xIntersect && yIntersect && isOneUnitHigher
}

function isLineIntersecting(lineA, lineB) {
    let minXLineA = Math.min(lineA.start, lineA.end)
    let maxXLineA = Math.max(lineA.start, lineA.end)
    let minXLineB = Math.min(lineB.start, lineB.end)
    let maxXLineB = Math.max(lineB.start, lineB.end)

    return (minXLineA <= maxXLineB && maxXLineA >= minXLineB) || (minXLineB <= maxXLineA && maxXLineB >= minXLineA)
}
