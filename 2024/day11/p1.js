const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let stones = data.split(' ')
    for (let i = 0; i < 25; i++) {
        stones = blink(stones)
    }

    console.log(stones.length)
})

function blink(stones) {
    let newStones = []
    for (let i = 0; i <= stones.length - 1; i++) {
        let stone = stones[i]
        if (stone === '0') {
            newStones.push('1')
            continue
        }
        let result = computeStone(stone)
        newStones.push(...result)
    }
    return newStones
}

function computeStone(numberString) {
    if (numberString.length % 2 === 0) {
        let half = numberString.length / 2
        let firstHalf = numberString.substring(0, half)
        let secondHalf = numberString.substring(half)
        return [(+firstHalf).toString(), (+secondHalf).toString()]
    } else {
        return [(+numberString * 2024).toString()]
    }
}
