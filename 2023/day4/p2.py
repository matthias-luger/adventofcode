import re

lines = open("input.txt", "r").readlines()

winMap = {}
amountMap = {}

for index, line in enumerate(lines):
    parts = line.split("|")
    firstNumbers = re.findall(r"\d+", parts[0].split(":")[1].strip())
    secondNumbers = re.findall(r"\d+", parts[1].strip())

    both = list(set(firstNumbers) & set(secondNumbers))
    winMap[index] = len(both)

for index, line in enumerate(lines):
    if amountMap.get(index) is None:
        amountMap[index] = 1
    else:
        amountMap[index] += 1

    wins = winMap[index]

    for x in range(index + 1, index + wins + 1):
        if amountMap.get(x) is None:
            amountMap[x] = amountMap[index]
        else:
            amountMap[x] += amountMap[index]


print(sum(amountMap.values()))
