import re


def parseInput(lines: list[str]):
    mappingGroups = []
    currentMappingGroup = []
    seedsRanges = []
    for index, line in enumerate(lines):
        if index == 0:
            seedsRanges = list(
                map(
                    lambda x: list(map(int, x.split(" "))), re.findall(r"\d+ \d+", line)
                )
            )
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

    for mappingGroup in mappingGroups:
        mappingGroup.sort(key=lambda x: x["source"])

    return (mappingGroups, seedsRanges)


def getDestination(mappingGroups: list[dict], seedsRange: (int, int)):
    currentRanges = [seedsRange]
    for mappingGroup in mappingGroups:
        newRanges = []
        for currentRange in currentRanges:
            newRanges = newRanges + mapRangeToMappings(mappingGroup, currentRange)
        currentRanges = newRanges

    return currentRanges


def mapRangeToMappings(mappings: list[dict], seedRange: (int, int)):
    results = []
    remaining = [seedRange]

    for mapping in mappings:
        nextRemaining = []
        for range in remaining:
            [snipped, remainingAfterMapping] = mapRangeToMapping(mapping, range)
            if snipped != None:
                results.append(snipped)
            nextRemaining = nextRemaining + remainingAfterMapping
        remaining = nextRemaining
    return results + remaining


def mapRangeToMapping(mapping: dict, range: (int, int)):
    mappingStart = mapping["source"]
    mappingEnd = mapping["source"] + mapping["amount"]
    rangeStart = range[0]
    rangeEnd = range[0] + range[1]

    if mappingEnd >= rangeStart and mappingStart <= rangeEnd:
        snipped_start = max(mappingStart, rangeStart)
        snipped_end = min(mappingEnd, rangeEnd)
        mapped_part = (
            (snipped_start - mapping["source"]) + mapping["destination"],
            (snipped_end - snipped_start),
        )

        remaining_ranges = []
        if rangeStart < mappingStart:
            remaining_ranges.append((rangeStart, mappingStart - rangeStart))
        if mappingEnd < rangeEnd:
            remaining_ranges.append((mappingEnd, rangeEnd - mappingEnd))

        return mapped_part, remaining_ranges
    else:
        return None, [(rangeStart, rangeEnd - rangeStart)]


lines = open("input.txt", "r").readlines()

(mappings, seedsRanges) = parseInput(lines)

destinationGroups = []
for seedRange in seedsRanges:
    destinationGroups.append(getDestination(mappings, seedRange))

minDestination = None
for destinationGroup in destinationGroups:
    currentMin = min(destination for destination in destinationGroup)
    if minDestination == None or currentMin[0] < minDestination:
        minDestination = currentMin[0]


print(minDestination)
