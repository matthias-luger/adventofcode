lines = open('input.txt', 'r').readlines()
dict = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5' : 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9
}

sum = 0
for line in lines:
    highestCurrentIndex = -1
    lowestCurrentIndex = len(line)
    highestCurrentValue = 0
    lowestCurrentValue = 0

    for key in dict.keys():
        index = line.find(key)
        lastIndex = line.rfind(key)

        if lastIndex != -1 and lastIndex > highestCurrentIndex:
            highestCurrentIndex = lastIndex
            highestCurrentValue = dict[key]
        if index != -1 and index < lowestCurrentIndex:
            lowestCurrentIndex = index
            lowestCurrentValue = dict[key]

    toAdd = str(lowestCurrentValue) + str(highestCurrentValue)
    sum += int(toAdd)

print(sum)
    
    