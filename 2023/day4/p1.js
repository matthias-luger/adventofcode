const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let pointsTotal = 0
    let cards = parseCards(data.split('\r\n'))

    cards.forEach(card => {
        let points = 0

        card.numbers.forEach(number => {
            if (card.winningNumbers.includes(number)) {
                if (points === 0) {
                    points = 1
                } else {
                    points *= 2
                }
            }
        })
        pointsTotal += points
    })

    console.log(pointsTotal)
})

function parseCards(lines) {
    let cards = []
    lines.forEach(line => {
        let card = {}
        let parts = line.split(':')
        card.id = parts[0].split(' ')[1]

        let numberParts = parts[1].split('|')

        let numberRegexp = /\d+/g

        card.numbers = numberParts[0].match(numberRegexp).map(n => parseInt(n))
        card.winningNumbers = numberParts[1].match(numberRegexp).map(n => parseInt(n))
        cards.push(card)
    })
    return cards
}
