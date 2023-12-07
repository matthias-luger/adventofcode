const fs = require('fs')

const CARD_POINTS = {
    FIVE_OF_A_KIND: 700,
    FOUR_OF_A_KIND: 600,
    FULL_HOUSE: 500,
    THREE_OF_A_KIND: 400,
    TWO_PAIR: 300,
    ONE_PAIR: 200,
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2
}

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let hands = []

    lines.forEach(line => {
        let hand = {
            cards: {},
            strenght: 0,
            bid: 0
        }
        let split = line.split(' ')
        hand.bid = parseInt(split[1])
        hand.cardsString = split[0]
        split[0].split('').forEach(card => {
            hand.cards[card] = hand.cards[card] ? hand.cards[card] + 1 : 1
        })
        hand.strenght = getStrengthValue(hand)
        hands.push(hand)
    })

    hands = hands.sort((a, b) => {
        let diff = a.strenght - b.strenght
        if (diff === 0) {
            for (let i = 0; i < a.cardsString.length; i++) {
                if (CARD_POINTS[a.cardsString[i]] !== CARD_POINTS[b.cardsString[i]]) {
                    return CARD_POINTS[a.cardsString[i]] - CARD_POINTS[b.cardsString[i]]
                }
            }
        }
        return diff
    })

    let checkSum = 0
    hands.forEach((hand, i) => {
        checkSum += hand.bid * (i + 1)
    })

    console.log(checkSum)
})

function getStrengthValue(hand) {
    let cardTypes = Object.keys(hand.cards)
    let highestCardsAmount = 0
    let pairs = 0
    cardTypes.forEach(cardType => {
        if (hand.cards[cardType] > highestCardsAmount) {
            highestCardsAmount = hand.cards[cardType]
        }
        if (hand.cards[cardType] === 2) {
            pairs++
        }
    })

    if (highestCardsAmount === 5) {
        return CARD_POINTS.FIVE_OF_A_KIND
    }
    if (highestCardsAmount === 4) {
        return CARD_POINTS.FOUR_OF_A_KIND
    }
    if (isFullHouse(hand)) {
        return CARD_POINTS.FULL_HOUSE
    }
    if (highestCardsAmount === 3) {
        return CARD_POINTS.THREE_OF_A_KIND
    }
    if (pairs === 2) {
        return CARD_POINTS.TWO_PAIR
    }
    if (pairs === 1) {
        return CARD_POINTS.ONE_PAIR
    }
    return 0
}

function isFullHouse(hand) {
    let cardTypes = Object.keys(hand.cards)
    if (cardTypes.length !== 2) {
        return false
    }
    return hand.cards[cardTypes[0]] + hand.cards[cardTypes[1]] === 5
}
