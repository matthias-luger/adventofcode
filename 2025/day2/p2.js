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
        currentID = nextInvalidID.toString()
    }
}

function getNextInvalidID(id) {
    let possibleIDs = []
    let divisors = getDivisors(id.length)

    for (const divisor of divisors) {
        let part = id.substring(0, divisor)
        let candidateID = part.repeat(id.length / divisor)
        let nextCandidateID = (parseInt(part) + 1).toString().repeat(id.length / divisor)
        if (parseInt(candidateID) > parseInt(id) && candidateID.length > 1) {
            possibleIDs.push(parseInt(candidateID))
        }
        if (parseInt(nextCandidateID) > parseInt(id) && nextCandidateID.length === id.length && nextCandidateID.length > 1) {
            possibleIDs.push(parseInt(nextCandidateID))
        }
    }

    if (possibleIDs.length === 0) {
        let next = (parseInt(id) + (Math.pow(10, id.length) - parseInt(id))).toString()
        return getNextInvalidID(next)
    }

    return Math.min(...possibleIDs)
}

function getDivisors(number) {
    let divisors = []
    let curr = 1
    while (curr <= Math.round(number / 2)) {
        if (number % curr === 0) {
            divisors.push(curr)
        }
        curr++
    }
    return divisors
}
