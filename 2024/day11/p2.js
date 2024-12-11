const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let stones = data.split(' ')
    let sum = 0
    for (const stone of stones) {
        sum += getNumberOfStonesAfterBlinking(stone, 75)
    }
    console.log(sum)
})

let cache = new Map()
function getNumberOfStonesAfterBlinking(stone, numberOfBlinks) {
    if (cache.has(`${stone}:${numberOfBlinks}`)) {
        return cache.get(`${stone}:${numberOfBlinks}`)
    }
    if (numberOfBlinks === 1) {
        let result = computeStone(stone)
        cache.set(`${stone}:${numberOfBlinks}`, result.length)
        return result.length
    }
    let curr = computeStone(stone)
    let deeperResult = 0
    for (const c of curr) {
        let r = getNumberOfStonesAfterBlinking(c, numberOfBlinks - 1)
        cache.set(`${c}:${numberOfBlinks - 1}`, r)
        deeperResult += r
    }
    return deeperResult
}

function computeStone(numberString) {
    if (numberString === '0') {
        return ['1']
    }
    if (numberString.length % 2 === 0) {
        let half = numberString.length / 2
        let firstHalf = numberString.substring(0, half)
        let secondHalf = numberString.substring(half)
        return [(+firstHalf).toString(), (+secondHalf).toString()]
    } else {
        return [(+numberString * 2024).toString()]
    }
}
