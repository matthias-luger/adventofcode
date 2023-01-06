lines = open("input.txt", "r").readlines()
increases = 0

numbers = []
for line in lines:
    numbers.append(int(line))

windowSizes = []
for num1, num2, num3 in zip(windowSizes, windowSizes[1:], windowSizes[2:]):
    windowSizes.append(num1 + num2 + num3)

increases = 0
for num1, num2 in zip(windowSizes, windowSizes[1:]):
    if num1 < num2:
        increases += 1
print(increases)
    