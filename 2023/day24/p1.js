const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let hailstones = lines.map(parseHailstone)

    let TEST_AREA = {
        from: 200000000000000,
        to: 400000000000000
    }

    let sum = 0
    for (let i = 0; i < hailstones.length; i++) {
        let hailstoneA = hailstones[i]
        for (let j = i + 1; j < hailstones.length; j++) {
            let hailstoneB = hailstones[j]

            let { x, y } = getIntersection(hailstoneA, hailstoneB)

            if (x > TEST_AREA.from && x < TEST_AREA.to && y > TEST_AREA.from && y < TEST_AREA.to) {
                sum++
            }
        }
    }

    console.log(sum)
})

function getIntersection(hailstoneA, hailstoneB) {
    let gradientA = hailstoneA.vy / hailstoneA.vx
    let gradientB = hailstoneB.vy / hailstoneB.vx

    let yInterseptA = hailstoneA.y - gradientA * hailstoneA.x
    let yInterseptB = hailstoneB.y - gradientB * hailstoneB.x

    let x = (yInterseptB - yInterseptA) / (gradientA - gradientB)
    let y = gradientA * x + yInterseptA

    let checkA = checkIfPointIsOnCorrectSide(hailstoneA, x, y)
    let checkB = checkIfPointIsOnCorrectSide(hailstoneB, x, y)

    if (!checkA || !checkB) {
        return { x: -Infinity, y: -Infinity }
    }

    return {
        x,
        y
    }
}

function checkIfPointIsOnCorrectSide(hailstone, pointX, pointY) {
    if (hailstone.vx > 0 && pointX < hailstone.x) return false
    if (hailstone.vx < 0 && pointX > hailstone.x) return false
    if (hailstone.vy > 0 && pointY < hailstone.y) return false
    if (hailstone.vy < 0 && pointY > hailstone.y) return false
    return true
}

function parseHailstone(line) {
    let [coordinates, velocity] = line.split('@')
    let [x, y, z] = coordinates.trim().split(',')
    let [vx, vy, vz] = velocity.trim().split(',')

    return {
        x: parseInt(x),
        y: parseInt(y),
        z: parseInt(z),
        vx: parseInt(vx),
        vy: parseInt(vy),
        vz: parseInt(vz)
    }
}
