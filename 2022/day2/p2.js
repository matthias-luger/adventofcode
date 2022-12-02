const fs = require('fs')

const GAME = {
    A: { name: 'ROCK', value: 1, WIN: 'C', LOOSE: 'B', DRAW: 'A' },
    B: { name: 'PAPER', value: 2, WIN: 'A', LOOSE: 'C', DRAW: 'B' },
    C: { name: 'SCISSORS', value: 3, WIN: 'B', LOOSE: 'A', DRAW: 'C' },
    X: { name: 'ROCK', value: 1 },
    Y: { name: 'PAPER', value: 2 },
    Z: { name: 'SCISSORS', value: 3 }
}

const POINTS = {
    LOSS: 0,
    DRAW: 3,
    WIN: 6
}

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let points = 0
    split.forEach(value => {
        let opponent = GAME[value[0]]
        let move = calculateMove(opponent, value[2])
        points += calculatePoints(move, opponent)
    })
    console.log(points)
})

function calculateMove(move, target) {
    if (target === 'X') {
        return GAME[move.WIN]
    }
    if (target === 'Y') {
        return GAME[move.DRAW]
    }
    if (target === 'Z') {
        return GAME[move.LOOSE]
    }
}

function calculatePoints(p1, p2) {
    let points = 0
    if (p1.name === p2.name) {
        points = POINTS.DRAW
    } else {
        if (p1.name === 'ROCK') {
            points = p2.name === 'PAPER' ? POINTS.LOSS : POINTS.WIN
        }
        if (p1.name === 'PAPER') {
            points = p2.name === 'SCISSORS' ? POINTS.LOSS : POINTS.WIN
        }
        if (p1.name === 'SCISSORS') {
            points = p2.name === 'ROCK' ? POINTS.LOSS : POINTS.WIN
        }
    }
    return points + p1.value
}
