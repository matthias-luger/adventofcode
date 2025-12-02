const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let ranges = data.split(',')
    let erg = []
    for (const range of ranges) {
        let invalidIDs = getInvalidIDs(range)
        erg = erg.concat(invalidIDs)
    }
    console.log(erg.map(x => parseInt(x)).reduce((a, b) => a + b, 0))
})

function getInvalidIDs(range) {
    let [start, end] = range.split('-').map(x => parseInt(x))
    let invalidIDs = []
    let currentID = (parseInt(start) - 1).toString()
    let endAsNumber = parseInt(end)
    while (true) {
        let nextInvalidID = getNextInvalidID(currentID)
        if (parseInt(nextInvalidID) > endAsNumber) {
            return invalidIDs
        }
        invalidIDs.push(nextInvalidID)
        currentID = (parseInt(nextInvalidID) + 1).toString()
    }
}

function getNextInvalidID(id) {
    if (id.length % 2 === 1) {
        let next = (parseInt(id) + (Math.pow(10, id.length) - parseInt(id))).toString()
        if (isInvalidID(next)) {
            return next
        } else {
            return getNextInvalidID(next)
        }
    }
    let firstHalf = id.substring(0, id.length / 2)
    let secondHalf = id.substring(id.length / 2)
    if (parseInt(secondHalf) > parseInt(firstHalf)) {
        return (parseInt(firstHalf) + 1).toString().repeat(2)
    } else {
        return firstHalf.repeat(2)
    }
}

function isInvalidID(id) {
    let firstHalf = id.substring(0, id.length / 2)
    let secondHalf = id.substring(id.length / 2)
    return firstHalf === secondHalf
}
