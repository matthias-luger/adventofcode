def hasSpecialSymbolAround(x: int, y: int, map: dict):
    if isSpecialSymbol(map.get((x - 1, y))):
        return True
    if isSpecialSymbol(map.get((x + 1, y))):
        return True
    if isSpecialSymbol(map.get((x, y - 1))):
        return True
    if isSpecialSymbol(map.get((x, y + 1))):
        return True
    if isSpecialSymbol(map.get((x - 1, y - 1))):
        return True
    if isSpecialSymbol(map.get((x + 1, y - 1))):
        return True
    if isSpecialSymbol(map.get((x - 1, y + 1))):
        return True
    if isSpecialSymbol(map.get((x + 1, y + 1))):
        return True
    return False


def isSpecialSymbol(char: str):
    return char != None and char != "." and char.isdigit() == False


def main():
    lines = open("input.txt", "r").readlines()

    map = {}
    width = len(lines[0].strip())
    height = len(lines)
    sum = 0

    for y, line in enumerate(lines):
        line = line.strip()
        for x, char in enumerate(line):
            map[(x, y)] = char

    currentNumber = ""
    currentNumberHasSpecialSymbolAround = False
    for y in range(height):
        for x in range(width):
            char = str(map[(x, y)])
            if char.isdigit():
                currentNumber += char
                if hasSpecialSymbolAround(x, y, map):
                    currentNumberHasSpecialSymbolAround = True
                if str(map.get((x + 1, y))).isdigit() == False:
                    if currentNumberHasSpecialSymbolAround:
                        sum += int(currentNumber)
                    currentNumber = ""
                    currentNumberHasSpecialSymbolAround = False
    print(sum)


if __name__ == "__main__":
    main()
