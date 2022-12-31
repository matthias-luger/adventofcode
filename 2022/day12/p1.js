const fs = require('fs')
const { dijkstra } = require('./dijkstra')

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

    console.log(dijkstra(graph, start, end).distance)
})
