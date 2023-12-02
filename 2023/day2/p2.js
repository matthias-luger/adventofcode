const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let games = parseInput(lines)

    let checkSum = 0
    games.forEach(game => {
        let minCubes = {
            red: 0,
            green: 0,
            blue: 0
        }
        game.games.forEach(round => {
            if (round.red > minCubes.red) {
                minCubes.red = round.red
            }
            if (round.green > minCubes.green) {
                minCubes.green = round.green
            }
            if (round.blue > minCubes.blue) {
                minCubes.blue = round.blue
            }
        })
        checkSum += minCubes.red * minCubes.green * minCubes.blue
    })

    console.log(checkSum)
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
