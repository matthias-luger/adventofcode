function getRelativeCoordinatesInArea(x, y, CUBE_SIZE) {
    let row = Math.floor(y / CUBE_SIZE)
    let column = Math.floor(x / CUBE_SIZE)

    return { x: x - column * CUBE_SIZE, y: y - row * CUBE_SIZE }
}

function getInputAreaRules(CUBE_SIZE) {
    return {
        2: {
            W: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 0, y: 3 * CUBE_SIZE - 1 - relativeCoordinates.y }
                },
                newOrientation: 'O'
            },
            N: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 0, y: 3 * CUBE_SIZE + relativeCoordinates.x }
                },
                newOrientation: 'O'
            }
        },
        3: {
            O: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 2 * CUBE_SIZE - 1, y: 3 * CUBE_SIZE - 1 - relativeCoordinates.y }
                },
                newOrientation: 'W'
            },
            N: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: relativeCoordinates.x, y: 4 * CUBE_SIZE - 1 }
                },
                newOrientation: 'N'
            },
            S: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 2 * CUBE_SIZE - 1, y: CUBE_SIZE + relativeCoordinates.x }
                },
                newOrientation: 'W'
            }
        },
        9: {
            W: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: CUBE_SIZE, y: CUBE_SIZE - relativeCoordinates.y - 1 }
                },
                newOrientation: 'O'
            },
            N: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: CUBE_SIZE, y: CUBE_SIZE + relativeCoordinates.x }
                },
                newOrientation: 'O'
            }
        },
        10: {
            S: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: CUBE_SIZE - 1, y: 3 * CUBE_SIZE + relativeCoordinates.x }
                },
                newOrientation: 'W'
            },
            O: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 3 * CUBE_SIZE - 1, y: CUBE_SIZE - relativeCoordinates.y - 1 }
                },
                newOrientation: 'W'
            }
        },
        13: {
            S: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: CUBE_SIZE * 2 + relativeCoordinates.x, y: 0 }
                },
                newOrientation: 'S'
            },
            O: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: CUBE_SIZE + relativeCoordinates.y, y: 3 * CUBE_SIZE - 1 }
                },
                newOrientation: 'N'
            },
            W: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: CUBE_SIZE + relativeCoordinates.y, y: 0 }
                },
                newOrientation: 'S'
            }
        },
        6: {
            W: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: relativeCoordinates.y, y: 2 * CUBE_SIZE }
                },
                newOrientation: 'S'
            },
            O: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 2 * CUBE_SIZE + relativeCoordinates.y, y: CUBE_SIZE - 1 }
                },
                newOrientation: 'N'
            }
        }
    }
}

function getSampleAreaRules(CUBE_SIZE) {
    return {
        3: {
            N: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: x - CUBE_SIZE * 2 - relativeCoordinates.x + (CUBE_SIZE - relativeCoordinates.x) - 1, y: y + CUBE_SIZE }
                },
                newOrientation: 'S'
            },
            W: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: x - (CUBE_SIZE - relativeCoordinates.y), y: y + (CUBE_SIZE - relativeCoordinates.y) }
                },
                newOrientation: 'S'
            },
            O: {
                getNewCoords: (x, y) => {
                    return { x: x + CUBE_SIZE, y: y + 2 * CUBE_SIZE }
                },
                newOrientation: 'W'
            }
        },
        5: {
            N: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: x + CUBE_SIZE * 2 - relativeCoordinates.x + (CUBE_SIZE - relativeCoordinates.x) - 1, y: y - CUBE_SIZE }
                },
                newOrientation: 'S'
            },
            S: {
                getNewCoords: (x, y) => {
                    return { x: x + 2 * CUBE_SIZE, y: 11 }
                },
                newOrientation: 'N'
            },
            W: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: x + 3 * CUBE_SIZE + relativeCoordinates.y, y: 11 }
                },
                newOrientation: 'N'
            }
        },
        6: {
            N: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: x + (CUBE_SIZE - relativeCoordinates.x), y: y - (CUBE_SIZE - relativeCoordinates.x) }
                },
                newOrientation: 'O'
            },
            S: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: x + (CUBE_SIZE - relativeCoordinates.x), y: y + (CUBE_SIZE - relativeCoordinates.x) }
                },
                newOrientation: 'O'
            }
        },
        7: {
            O: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: x + (CUBE_SIZE - relativeCoordinates.y), y: 8 }
                },
                newOrientation: 'S'
            }
        },
        11: {
            W: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 4 + relativeCoordinates.y, y: 7 }
                },
                newOrientation: 'N'
            },
            S: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 0 + (CUBE_SIZE - relativeCoordinates.x) - 1, y: 7 }
                },
                newOrientation: 'N'
            }
        },
        12: {
            N: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 11, y: 4 + relativeCoordinates.x }
                },
                newOrientation: 'W'
            },
            O: {
                getNewCoords: (x, y) => {
                    return { x: x - CUBE_SIZE, y: y - 2 * CUBE_SIZE }
                },
                newOrientation: 'W'
            },
            S: {
                getNewCoords: (x, y) => {
                    let relativeCoordinates = getRelativeCoordinatesInArea(x, y, CUBE_SIZE)
                    return { x: 0, y: y - CUBE_SIZE - relativeCoordinates.x }
                },
                newOrientation: 'O'
            }
        }
    }
}

function getAreaRules(filename, CUBE_SIZE) {
    if (filename.includes('input')) {
        return getInputAreaRules(CUBE_SIZE)
    } else {
        return getSampleAreaRules(CUBE_SIZE)
    }
}

module.exports = {
    getAreaRules
}
