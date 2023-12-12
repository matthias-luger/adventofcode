const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let springMaps = lines.map(line => {
        let parts = line.split(' ')
        let numbers = parts[1].split(',').map(Number)

        return {
            springs: parts[0],
            amounts: numbers
        }
    })

    let checkSum = 0
    springMaps.forEach(springMap => {
        let possibleSolves = getPossibleSolves(springMap)
        checkSum += possibleSolves.size
    })
    console.log(checkSum)
})

function getPossibleSolves(spring) {
    let possibleSprings = new Set()
    let queue = [spring]

    while (queue.length > 0) {
        let { springs, amounts } = queue.shift()

        let questionMarkIndex = springs.indexOf('?')
        if (questionMarkIndex === -1) {
            let regexp = /#+/g
            let springsMatches = springs.match(regexp)

            if (!springsMatches) {
                continue
            }
            if (springsMatches.length !== amounts.length) {
                continue
            }
            let isValid = springsMatches.every((match, index) => match.length === amounts[index])
            if (isValid) {
                possibleSprings.add(springs)
            }
        } else {
            let possibility1 = springs.replace('?', '.')
            let possibility2 = springs.replace('?', '#')
            if (checkIfSpringStringIsPossible(possibility1, amounts)) {
                queue.push({
                    springs: possibility1,
                    amounts: amounts
                })
            }
            if (checkIfSpringStringIsPossible(possibility2, amounts)) {
                queue.push({
                    springs: possibility2,
                    amounts: amounts
                })
            }
        }
    }

    return possibleSprings
}

function checkIfSpringStringIsPossible(springString, amounts) {
    let indexOfFirstQuestionMark = springString.indexOf('?')
    let untilQuestionMark = springString.substring(0, indexOfFirstQuestionMark)

    let regexp = /#+/g

    let springs = untilQuestionMark.match(regexp)
    if (!springs) {
        return true
    }

    for (let i = 0; i < springs.length - 1; i++) {
        if (springs[i].length !== amounts[i]) {
            return false
        }
    }
    return true
}
