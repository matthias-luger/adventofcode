import re

lines = open("input.txt", "r").readlines()

sum = 0
for line in lines:
    parts = line.split("|")
    firstNumbers = re.findall(r"\d+", parts[0].split(":")[1].strip())
    secondNumbers = re.findall(r"\d+", parts[1].strip())

    both = list(set(firstNumbers) & set(secondNumbers))
    if len(both) > 0:
        sum += 2 ** (len(both) - 1)

print(sum)
