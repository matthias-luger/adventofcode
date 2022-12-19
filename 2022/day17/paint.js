module.exports = {
    paintMap: function (map) {
        for (let y = map.highestSolid + 5; y >= 0; y--) {
            let line = ''
            for (let x = 0; x < 7; x++) {
                line += getCoords(map, x, y)
            }
            console.log(line)
        }
    }
}

function getCoords(map, x, y) {
    if (y < 0 || x < 0 || x > 6) {
        return '#'
    }
    if (!map.coords[x + ':' + y]) {
        return '.'
    }
    return map.coords[x + ':' + y]
}
