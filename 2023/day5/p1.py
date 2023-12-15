import re


def parseInput(lines: list[str]):
    mappingGroups = []
    currentMappingGroup = []
    seeds = []
    for index, line in enumerate(lines):
        if index == 0:
            seeds = list(map(int, re.findall(r"\d+", line)))
            continue
        if index == 1:
            continue
        if line.find(":") != -1:
            continue

        if len(line.strip()) == 0:
            mappingGroups.append(currentMappingGroup)
            currentMappingGroup = []
            continue
        else:
            mappingNumbers = list(map(int, re.findall(r"\d+", line)))
            currentMappingGroup.append(
                {
                    "destination": mappingNumbers[0],
                    "source": mappingNumbers[1],
                    "amount": mappingNumbers[2],
                }
            )
    mappingGroups.append(currentMappingGroup)

    return (mappingGroups, seeds)


def getDestination(mappingGroups: list[dict], seed: int):
    currentValue = seed
    for mappingGroup in mappingGroups:
        for mapping in mappingGroup:
            if (
                mapping["source"] <= currentValue
                and mapping["source"] + mapping["amount"] > currentValue
            ):
                currentValue = mapping["destination"] + (
                    currentValue - mapping["source"]
                )
                break

    return currentValue


lines = open("input.txt", "r").readlines()

(mappings, seeds) = parseInput(lines)

destinations = []
for seed in seeds:
    destinations.append(getDestination(mappings, seed))

print(min(destinations))
