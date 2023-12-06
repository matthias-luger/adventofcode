def hasGearAround(x: int, y: int, map: dict):
    if isGearSymbol(map.get((x - 1, y))):
        return (x - 1, y)
    if isGearSymbol(map.get((x + 1, y))):
        return (x + 1, y)
    if isGearSymbol(map.get((x, y - 1))):
        return (x, y - 1)
    if isGearSymbol(map.get((x, y + 1))):
        return (x, y + 1)
    if isGearSymbol(map.get((x - 1, y - 1))):
        return (x - 1, y - 1)
    if isGearSymbol(map.get((x + 1, y - 1))):
        return (x + 1, y - 1)
    if isGearSymbol(map.get((x - 1, y + 1))):
        return (x - 1, y + 1)
    if isGearSymbol(map.get((x + 1, y + 1))):
        return (x + 1, y + 1)
    return None


def isGearSymbol(char: str):
    return char == "*"


def main():
    lines = open("input.txt", "r").readlines()

    map = {}
    width = len(lines[0].strip())
    height = len(lines)
    gearMap = {}

    for y, line in enumerate(lines):
        line = line.strip()
        for x, char in enumerate(line):
            map[(x, y)] = char

    currentNumber = ""
    gearsOfCurrentNumbers = set()
    for y in range(height):
        for x in range(width):
            char = str(map[(x, y)])
            if char.isdigit():
                currentNumber += char
                gearCoordinates = hasGearAround(x, y, map)
                if gearCoordinates != None:
                    gearsOfCurrentNumbers.add(gearCoordinates)
                if str(map.get((x + 1, y))).isdigit() == False:
                    if len(gearsOfCurrentNumbers) > 0:
                        for gear in gearsOfCurrentNumbers:
                            if gearMap.get(gear) == None:
                                gearMap[gear] = [currentNumber]
                            else:
                                gearMap[gear].append(currentNumber)
                    currentNumber = ""
                    gearsOfCurrentNumbers = set()
    
    checksum = 0
    for gearCoordinates in gearMap.keys():
        if len(gearMap[gearCoordinates]) == 2:
            checksum += int(gearMap[gearCoordinates][0]) * int(gearMap[gearCoordinates][1])
    print(checksum)


if __name__ == "__main__":
    main()
