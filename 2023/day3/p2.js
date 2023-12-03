const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n').map(line => line.split(''))
    let gearMap = {}

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]

        let currentNumber = ''
        let currentGearCoordinates
        for (let j = 0; j < line.length; j++) {
            let char = line[j]

            if (!isNaN(char)) {
                currentNumber += char
                let currentGear = hasGearNear(lines, i, j)
                if (currentGear) {
                    currentGearCoordinates = currentGear
                }

                if (j === line.length - 1) {
                    if (currentGearCoordinates && !isNaN(currentNumber)) {
                        let value = gearMap[currentGearCoordinates.toString()]
                        if (value) {
                            gearMap[currentGearCoordinates.toString()] = [...gearMap[currentGearCoordinates.toString()], parseInt(currentNumber)]
                        } else {
                            gearMap[currentGearCoordinates.toString()] = [parseInt(currentNumber)]
                        }
                    }
                }
            } else {
                if (currentGearCoordinates && !isNaN(currentNumber)) {
                    let value = gearMap[currentGearCoordinates.toString()]
                    if (value) {
                        gearMap[currentGearCoordinates.toString()] = [...gearMap[currentGearCoordinates.toString()], parseInt(currentNumber)]
                    } else {
                        gearMap[currentGearCoordinates.toString()] = [parseInt(currentNumber)]
                    }
                }
                currentNumber = ''
                currentGearCoordinates = undefined
            }
        }
    }

    let checkSum = 0
    Object.keys(gearMap).forEach(key => {
        if (gearMap[key].length === 2) {
            let [x, y] = gearMap[key]
            checkSum += x * y
        }
    })

    console.log(checkSum)
})

function hasGearNear(lines, y, x) {
    if (y > 0) {
        let ytoCheck = y - 1
        if (isGear(lines[ytoCheck][x])) {
            return [ytoCheck, x]
        }
        if (isGear(lines[ytoCheck][x + 1])) {
            return [ytoCheck, x + 1]
        }
        if (isGear(lines[ytoCheck][x - 1])) {
            return [ytoCheck, x - 1]
        }
    }
    if (y < lines.length - 1) {
        let yToCheck = y + 1
        if (isGear(lines[yToCheck][x])) {
            return [yToCheck, x]
        }
        if (isGear(lines[yToCheck][x + 1])) {
            return [yToCheck, x + 1]
        }
        if (isGear(lines[yToCheck][x - 1])) {
            return [yToCheck, x - 1]
        }
    }

    if (x > 0) {
        let xToCheck = x - 1
        if (isGear(lines[y][xToCheck])) {
            return [y, xToCheck]
        }
    }
    if (x < lines[y].length - 1) {
        let xToCheck = x + 1
        if (isGear(lines[y][xToCheck])) {
            return [y, xToCheck]
        }
    }
    return undefined
}

function isGear(char) {
    return char === '*'
}
