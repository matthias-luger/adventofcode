import re


def main():
    lines = open("input.txt", "r").readlines()

    times = list(map(int, re.findall(r"\d+", lines[0])))
    distances = list(map(int, re.findall(r"\d+", lines[1])))

    races = list(zip(times, distances))

    result = 1
    for race in races:
        wins = 0
        for time in range(race[0]):
            distance = (race[0] - time) * time
            if distance > race[1]:
                wins += 1
        result *= wins

    print(result)


if __name__ == "__main__":
    main()
