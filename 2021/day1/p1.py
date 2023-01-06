lines = open("input.txt", "r").readlines()

numbers = []
for line in lines:
    numbers.append(int(line))

increases = 0
for num1, num2 in zip(numbers, numbers[1:]):
    if num1 < num2:
        increases += 1
print(increases)
    