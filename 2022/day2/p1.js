const fs = require('fs')

const GAME = {
    A: { name: 'ROCK', value: 1 },
    B: { name: 'PAPER', value: 2 },
    C: { name: 'SCISSORS', value: 3 },
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
        let me = GAME[value[0]]
        let opponent = GAME[value[2]]
        points += calculatePoints(opponent, me)
    })
    console.log(points)
})

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
