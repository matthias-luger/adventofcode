const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let coords = data.split('\r\n').map(x => x.split(',').map(n => parseInt(n)))
    let areas = []

    for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            let rect = [
                [coords[i][0], coords[i][1]],
                [coords[j][0], coords[j][1]]
            ]

            let isInArea = false
            for (let k = 0; k < coords.length; k++) {
                let [x1, y1] = k === 0 ? coords[coords.length - 1] : coords[k - 1]
                let [x2, y2] = coords[k]

                if (k === i || k === j) continue

                if (isLineInArea([x1, y1], [x2, y2], rect[0], rect[1])) {
                    isInArea = true
                    break
                }
            }
            if (!isInArea) {
                areas.push((Math.abs(rect[0][0] - rect[1][0]) + 1) * (Math.abs(rect[0][1] - rect[1][1]) + 1))
            }
            isInArea = false
        }
    }

    console.log(areas.sort((a, b) => b - a)[0])
})

function isLineInArea(linePointA, linePointB, areaCornerA, areaCornerB) {
    let [x1, y1] = linePointA
    let [x2, y2] = linePointB
    let [ax1, ay1] = areaCornerA
    let [ax2, ay2] = areaCornerB

    let minX = Math.min(ax1, ax2)
    let maxX = Math.max(ax1, ax2)
    let minY = Math.min(ay1, ay2)
    let maxY = Math.max(ay1, ay2)

    let point1InArea = x1 > minX && x1 < maxX && y1 > minY && y1 < maxY
    let point2InArea = x2 > minX && x2 < maxX && y2 > minY && y2 < maxY

    if (point1InArea || point2InArea) {
        return true
    }

    if (y1 === y2 && y1 > minY && y1 < maxY) {
        let lineMinX = Math.min(x1, x2)
        let lineMaxX = Math.max(x1, x2)
        return lineMaxX > minX && lineMinX < maxX
    }

    if (x1 === x2 && x1 > minX && x1 < maxX) {
        let lineMinY = Math.min(y1, y2)
        let lineMaxY = Math.max(y1, y2)
        return lineMaxY > minY && lineMinY < maxY
    }

    return false
}
