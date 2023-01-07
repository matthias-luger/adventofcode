lines = open("input.txt", "r").readlines()

horizontal = 0
depth = 0

for line in lines:
    parts = line.split(" ")
    match parts[0]:
        case "forward":
            horizontal = horizontal + int(parts[1])
        case "down":
            depth = depth + int(parts[1])
        case "up":
            depth = depth - int(parts[1])

print(horizontal * depth)
    