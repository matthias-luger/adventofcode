const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let cards = parseCards(data.split('\r\n'))

    let winMap = {}
    let amountMap = {}

    cards.forEach(card => {
        let winningNumberCount = 0

        card.numbers.forEach(number => {
            if (card.winningNumbers.includes(number)) {
                winningNumberCount++
            }
        })

        winMap[card.id] = winningNumberCount
        amountMap[card.id] = 1
    })

    cards.forEach(card => {
        let wins = winMap[card.id]

        for (let i = card.id + 1; i < card.id + 1 + wins; i++) {
            if (amountMap[i]) {
                amountMap[i] += amountMap[card.id]
            }
        }
    })

    let totalAmount = 0
    Object.keys(amountMap).forEach(cardId => {
        totalAmount += amountMap[cardId]
    })
    console.log(totalAmount)
})

function parseCards(lines) {
    let cards = []
    lines.forEach(line => {
        let card = {}
        let numberRegexp = /\d+/g

        let parts = line.split(':')
        card.id = parseInt(parts[0].match(numberRegexp)[0])

        let numberParts = parts[1].split('|')

        card.numbers = numberParts[0].match(numberRegexp).map(n => parseInt(n))
        card.winningNumbers = numberParts[1].match(numberRegexp).map(n => parseInt(n))
        cards.push(card)
    })
    return cards
}
