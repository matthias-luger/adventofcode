const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let instructions = lines[0].split('').map(e => (e === 'R' ? 1 : 0))
    let graph = {}
    let currentPoints = []

    for (let i = 0; i < lines.length; i++) {
        if (i < 2) continue
        let split = lines[i].split(' = ')

        let point = split[0]
        let path = split[1].split(', ').map(e => e.replace(/\(|\)/g, ''))
        graph[point] = path

        if (point.endsWith('A')) {
            currentPoints.push({ point })
        }
    }

    currentPoints.forEach((currentPoint, i) => {
        let steps = 0
        while (!currentPoint.point.endsWith('Z')) {
            let currentInstruction = instructions[steps % instructions.length]
            currentPoint.point = graph[currentPoint.point][currentInstruction]
            steps++
        }
        currentPoint.steps = steps
    })

    let numberList = currentPoints.map(e => e.steps)

    console.log(findLeastCommonMultipleOfList(numberList))
})

function greatestCommonDivisor(a, b) {
    return b === 0 ? a : greatestCommonDivisor(b, a % b)
}

function leastCommonMultiple(a, b) {
    return (a * b) / greatestCommonDivisor(a, b)
}

function findLeastCommonMultipleOfList(arr) {
    let result = 1
    for (let i = 0; i < arr.length; i++) {
        result = leastCommonMultiple(result, arr[i])
    }
    return result
}
