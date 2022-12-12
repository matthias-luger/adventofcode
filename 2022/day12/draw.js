const fs = require('fs')
const Graph = require('node-dijkstra')

String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length)
}

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let map = []
    split.forEach(value => {
        map.push(value)
    })
    let graph = {}
    let start = ''
    let end = ''

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            let char = map[y][x]
            if (char === 'S') {
                start = x + ':' + y
            }
            if (char === 'E') {
                end = x + ':' + y
            }
        }
        map[y] = map[y].replaceAll('S', String.fromCharCode('a'.charCodeAt(0) - 1))
        map[y] = map[y].replaceAll('E', String.fromCharCode('z'.charCodeAt(0) + 1))
    }

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            let pos = map[y][x].charCodeAt(0)
            if (!graph[x + ':' + y]) {
                graph[x + ':' + y] = {}
            }

            // check top
            if (y > 0) {
                let top = map[y - 1][x].charCodeAt(0)
                if (top - pos <= 1) {
                    graph[x + ':' + y][x + ':' + (y - 1)] = 1
                }
            }
            if (y < map.length - 1) {
                let bottom = map[y + 1][x].charCodeAt(0)
                if (bottom - pos <= 1) {
                    graph[x + ':' + y][x + ':' + (y + 1)] = 1
                }
            }
            if (x > 0) {
                let left = map[y][x - 1].charCodeAt(0)
                if (left - pos <= 1) {
                    graph[x + ':' + y][x - 1 + ':' + y] = 1
                }
            }
            if (x < map[0].length - 1) {
                let right = map[y][x + 1].charCodeAt(0)
                if (right - pos <= 1) {
                    graph[x + ':' + y][x + 1 + ':' + y] = 1
                }
            }
        }
    }

    let route = new Graph()
    Object.keys(graph).forEach(key => {
        route.addNode(key, graph[key])
    })

    let path = route.path(start, end)
    let pos = 0

    let interval = setInterval(() => {
        if (pos === path.length - 1) {
            clearInterval(interval)
        }
        let split = path[pos].split(':')
        let linie = map[+split[1]]
        map[+split[1]] = linie.substring(0, +split[0]) + 'X' + linie.substring(+split[0] + 1)
        console.log(map)
        pos++
    }, 200)
})
