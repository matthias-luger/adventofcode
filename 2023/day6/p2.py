import re
import math


def main():
    lines = open("input.txt", "r").readlines()

    time = int("".join(re.findall(r"\d+", lines[0])))
    distance = int("".join(re.findall(r"\d+", lines[1])))

    (resultA, resultB) = quadraticFormular(-1, time, -1 * distance)
    result = math.floor(resultB) - round(resultA)

    print(result)


def quadraticFormular(a, b, c):
    resultA = (-1 * b + (b**2 - 4 * a * c) ** 0.5) / (2 * a)
    resultB = (-1 * b - (b**2 - 4 * a * c) ** 0.5) / (2 * a)
    return (resultA, resultB)


if __name__ == "__main__":
    main()
