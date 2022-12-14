const fs = require('fs')
const { paintMap } = require('./paint')

const AIR = '.'
const ROCK = '@'
const SOLID = '#'
const GAS_RIGHT = '>'
const GAS_LEFT = '<'

fs.readFile('./input.txt', 'utf8', (err, steam) => {
    if (err) {
        console.error(err)
        return
    }
    fs.readFile('./rocks.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        let split = data.split('\r\n')
        let rocks = []
        let curr = []
        split.forEach(value => {
            if (value === '') {
                rocks.push(curr)
                curr = []
            } else {
                let line = []
                for (let i = 0; i < value.length; i++) {
                    const char = value[i]
                    line.push(char)
                }
                curr.push(line)
            }
        })
        onAfterRead(steam, rocks)
    })
})

function onAfterRead(steam, rocks) {
    let map = {
        coords: {},
        highestSolid: -1,
        movingRocks: [],
        floor: -1
    }

    let numberOfRocks = 0
    let i = 0
    while (numberOfRocks <= 2022) {
        if (map.movingRocks.length === 0) {
            setRockIntoMap(map, rocks[numberOfRocks % 5])
            numberOfRocks++
        }
        pushByAir(map, steam[i % steam.length])
        move(map)
        i++
    }
    console.log(map.highestSolid + 1)
}

function pushByAir(map, direction) {
    if (!map.movingRocks) {
        return
    }
    map.movingRocks.sort((a, b) => {
        if (direction === GAS_RIGHT) {
            return b.x - a.x
        } else {
            return a.x - b.x
        }
    })

    let isStopped = map.movingRocks.some(rock => {
        let besides = direction === GAS_RIGHT ? getCoords(map, rock.x + 1, rock.y) : getCoords(map, rock.x - 1, rock.y)
        return besides === SOLID
    })

    if (!isStopped) {
        for (let i = 0; i < map.movingRocks.length; i++) {
            let rock = map.movingRocks[i]
            let newX = direction === GAS_RIGHT ? rock.x + 1 : rock.x - 1
            setCoords(map, rock.x, rock.y, AIR)
            setCoords(map, newX, rock.y, ROCK)
            rock.x = newX
        }
    }
}

function move(map) {
    if (!map.movingRocks) {
        return
    }
    map.movingRocks.sort((a, b) => {
        return a.y - b.y
    })

    let stopped = map.movingRocks.some(rock => {
        let below = getCoords(map, rock.x, rock.y - 1)
        return below === SOLID
    })

    for (let i = 0; i < map.movingRocks.length; i++) {
        let rock = map.movingRocks[i]
        if (stopped === true) {
            setCoords(map, rock.x, rock.y, SOLID)
        } else {
            setCoords(map, rock.x, rock.y, AIR)
            setCoords(map, rock.x, rock.y - 1, ROCK)
            rock.y--
        }
    }
    if (stopped) {
        map.movingRocks = []
    }
}

function setRockIntoMap(map, rock) {
    for (let rockIndex = rock.length - 1; rockIndex >= 0; rockIndex--) {
        let space = 2
        for (let i = 0; i < rock[rockIndex].length; i++) {
            const char = rock[rockIndex][i]
            if (char === '#') {
                let x = space + i
                let y = map.highestSolid + (rock.length - rockIndex) + 3
                setCoords(map, x, y, ROCK)
                map.movingRocks.push({
                    x: x,
                    y: y
                })
            }
        }
    }
}

function setCoords(map, x, y, value) {
    if (value === SOLID && y > map.highestSolid) {
        map.highestSolid = y
    }
    map.coords[x + ':' + y] = value
}

function getCoords(map, x, y) {
    if (y < 0 || x < 0 || x > 6) {
        return SOLID
    }
    if (!map.coords[x + ':' + y]) {
        return AIR
    }
    return map.coords[x + ':' + y]
}
