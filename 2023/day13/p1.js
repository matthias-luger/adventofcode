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
    fields.forEach(field => {
        let turnedField = getFieldTurned(field)
        let mirrorY = getMirror(turnedField)
        let mirrorX = getMirror(field)

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

        if (rowA === rowB) {
            let previousRowAIndex = rowAIndex
            let previousRowBIndex = rowBIndex
            let isMatching = true
            while (isMatching) {
                rowAIndex--
                rowBIndex++
                if (rowAIndex < 0 || rowBIndex >= field.length) {
                    return [previousRowAIndex, previousRowBIndex]
                }
                if (field[rowAIndex] !== field[rowBIndex]) {
                    isMatching = false
                }
            }
            rowAIndex = previousRowAIndex
            rowBIndex = previousRowBIndex
        }
        rowAIndex++
        rowBIndex++
    }
}
