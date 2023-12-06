lines = open("sample.txt", "r").readlines()

numberRegexp = r"(\d+)"
checksum = 0

for index, line in enumerate(lines):
    line = line.split(":")[1]
    games = line.split(";")

    minCubes = {
        "red": 0,
        "green": 0,
        "blue": 0,
    }

    for game in games:
        game = game.strip()
        cubes = game.split(",")
        for cube in cubes:
            cube = cube.strip()
            color = cube.split(" ")[1]
            number = int(cube.split(" ")[0])

            if minCubes[color] < number:
                minCubes[color] = number

    checksum += minCubes["red"] * minCubes["green"] * minCubes["blue"]

print(checksum)
