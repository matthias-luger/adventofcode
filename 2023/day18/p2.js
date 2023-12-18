const fs = require('fs')

fs.readFile('./input.txt', 'utf8', async (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let instructions = parseInstructions(data.split('\r\n'))

    let currentPoint = [0, 0]
    let points = [currentPoint]

    let U = 0

    // Calculating the points in the coordinate system
    for (const instruction of instructions) {
        let xChange = instruction.direction[0] * instruction.amount
        let yChange = instruction.direction[1] * instruction.amount

        U += Math.abs(xChange + yChange)

        currentPoint = [currentPoint[0] + xChange, currentPoint[1] + yChange]

        points.push(currentPoint)
    }

    // Using the "Gaußsche Trapezformel" to calculate the area
    let sum = 0
    for (let i = 0; i < points.length - 1; i++) {
        let pointA = points[i]
        let pointB = points[i + 1]

        sum += pointA[0] * pointB[1] - pointA[1] * pointB[0]
    }
    sum /= 2

    // As these are grid points and not real coordinates, the area calculated is too small
    // e.g. a rectange with the points (0,0), (0,1), (1,0), (1,1) should return 4 as there are 4 points, but the calculation returns 1 as this would be correct in a coordinate system
    // To fix this, we add for each border step (circumference) 0.5 as there is technically half a grid point "outside"
    // Corners either have and additional 0.25 or 0.75, but as this is a loop, there are equal amounts of outside and inside corners, excluding the 4 outside corners. For these we also have to add 1 more area unit.
    console.log(sum + U * 0.5 + 1)
})

function parseInstructions(lines) {
    let result = []
    const directionChars = {
        3: [0, -1],
        0: [1, 0],
        1: [0, 1],
        2: [-1, 0]
    }
    for (const line of lines) {
        let rgb = line.split(' ')[2]
        rgb = rgb.replace(/(\(|\)|\#)/g, '')
        let direction = rgb.substring(rgb.length - 1)
        let amount = parseInt(rgb.substring(0, rgb.length - 1), 16)

        result.push({
            direction: directionChars[direction],
            amount
        })
    }
    return result
}
