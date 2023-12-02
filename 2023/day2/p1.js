const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let games = parseInput(lines)

    let maxCubes = {
        red: 12,
        green: 13,
        blue: 14
    }

    let checksum = 0
    games.forEach(game => {
        let isPossible = true
        game.games.forEach(round => {
            if (round.red > maxCubes.red || round.green > maxCubes.green || round.blue > maxCubes.blue) {
                isPossible = false
            }
        })
        if (isPossible) {
            checksum += game.id
        }
    })

    console.log(checksum)
})

function parseInput(lines) {
    let result = []
    lines.forEach(line => {
        if (!line) return
        let currentResult = {}

        currentResult.id = parseInt(line.split(':')[0].split(' ')[1])

        let games = line.split(': ')[1].split('; ')
        currentResult.games = []
        games.forEach(game => {
            let currentGame = {}
            let rounds = game.split(', ')
            rounds.forEach(round => {
                let amount = round.split(' ')[0]
                let color = round.split(' ')[1]
                currentGame[color] = parseInt(amount)
            })
            currentResult.games.push(currentGame)
        })

        result.push(currentResult)
    })
    return result
}
