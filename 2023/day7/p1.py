from functools import cmp_to_key


def main():
    lines = open("input.txt", "r").readlines()

    cards = [line.split() for line in lines]

    sortedCards = []
    for card in cards:
        points = calcPoints(card[0])
        sortedCards.append((card[0], card[1], points))

    sortedCards.sort(key=cmp_to_key(cardComparator), reverse=True)

    result = sum(
        [(int(card[1]) * (index + 1)) for (index, card) in enumerate(sortedCards)]
    )
    print(result)


def cardComparator(cardA: tuple, cardB: tuple):
    if cardA[2] != cardB[2]:
        return cardB[2] - cardA[2]

    card_points = {
        "A": 14,
        "K": 13,
        "Q": 12,
        "J": 11,
        "T": 10,
        "9": 9,
        "8": 8,
        "7": 7,
        "6": 6,
        "5": 5,
        "4": 4,
        "3": 3,
        "2": 2,
    }

    for i in range(5):
        if card_points[cardA[0][i]] != card_points[cardB[0][i]]:
            return card_points[cardB[0][i]] - card_points[cardA[0][i]]

    return 0


def calcPoints(card: str):
    cardMap = {}

    for char in card:
        if char in cardMap:
            cardMap[char] += 1
        else:
            cardMap[char] = 1

    if 5 in cardMap.values():
        return 5000
    if 4 in cardMap.values():
        return 4000
    if 2 in cardMap.values() and 3 in cardMap.values():
        return 3000
    if 3 in cardMap.values():
        return 2000
    if 2 in cardMap.values() and len(cardMap.keys()) == 3:
        return 1000
    if 2 in cardMap.values():
        return 500
    return 0


if __name__ == "__main__":
    main()
