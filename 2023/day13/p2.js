const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let fields = []
    let current = []
    lines.forEach(line => {
        if (line === '') {
            fields.push(current)
            current = []
        } else {
            current.push(line)
        }
    })
    fields.push(current)

    let checkSum = 0
    fields.forEach((field, index) => {
        let turnedField = getFieldTurned(field)
        let mirrorX = getMirror(field)
        let mirrorY = getMirror(turnedField)

        if (mirrorX) {
            checkSum += (mirrorX[0] + 1) * 100
        }
        if (mirrorY) {
            checkSum += mirrorY[0] + 1
        }
    })
    console.log(checkSum)
})

function getFieldTurned(field) {
    let turnedFields = []

    for (let x = 0; x < field[0].length; x++) {
        let currentColumn = ''
        for (let y = 0; y < field.length; y++) {
            currentColumn = field[y][x] + currentColumn
        }
        turnedFields.push(currentColumn)
        currentColumn = ''
    }

    return turnedFields
}

function getMirror(field) {
    let rowAIndex = 0
    let rowBIndex = 1
    while (rowBIndex < field.length) {
        let rowA = field[rowAIndex]
        let rowB = field[rowBIndex]
        let differences = getDifferences(rowA, rowB)

        if (differences < 2) {
            let previousRowAIndex = rowAIndex
            let previousRowBIndex = rowBIndex
            while (differences < 2) {
                rowAIndex--
                rowBIndex++
                if (rowAIndex < 0 || rowBIndex >= field.length) {
                    if (differences === 1) {
                        return [previousRowAIndex, previousRowBIndex]
                    } else {
                        break
                    }
                }
                differences += getDifferences(field[rowAIndex], field[rowBIndex])
            }
            rowAIndex = previousRowAIndex
            rowBIndex = previousRowBIndex
        }
        rowAIndex++
        rowBIndex++
    }
}

function getDifferences(lineA, lineB) {
    let differences = 0
    for (let i = 0; i < lineA.length; i++) {
        if (lineA[i] !== lineB[i]) {
            differences++
        }
    }
    return differences
}
