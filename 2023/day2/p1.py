lines = open("input.txt", "r").readlines()

maxCubes = {
    "red": 12,
    "green": 13,
    "blue": 14,
}

numberRegexp = r"(\d+)"
checksum = 0

for index, line in enumerate(lines):
    line = line.split(":")[1]
    games = line.split(";")

    isPossible = True
    for game in games:
        game = game.strip()
        cubes = game.split(",")
        for cube in cubes:
            cube = cube.strip()
            color = cube.split(" ")[1]
            number = int(cube.split(" ")[0])

            if number > maxCubes[color]:
                isPossible = False
                break

    if isPossible:
        checksum += index + 1

print(checksum)
