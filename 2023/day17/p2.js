const fs = require('fs')
const { dijkstra } = require('./dijkstra')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let map = new Map()
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map.set(`${x},${y}`, parseInt(char))
        })
    })

    let target = [lines[0].length - 1, lines.length - 1]
    let graph = {}
    for (const key of map.keys()) {
        let [x, y] = key.split(',').map(v => parseInt(v))
        addGraphNodes(map, x, y, graph, x === 0 && y === 0, target)
    }

    let result = dijkstra(graph, '0,0', `${target[0]},${target[1]}`)
    console.log(result)
})

function addGraphNodes(map, x, y, graph, isStartNode, target) {
    let directions = [
        { direction: 'S', coordinates: [0, 1], back: 'N' },
        { direction: 'N', coordinates: [0, -1], back: 'S' },
        { direction: 'E', coordinates: [1, 0], back: 'W' },
        { direction: 'W', coordinates: [-1, 0], back: 'E' }
    ]

    for (const currentDirection of directions) {
        let graphNode = {}

        for (const directionTo of directions) {
            if (directionTo.direction === currentDirection.direction || directionTo.direction === currentDirection.back) {
                if (!isStartNode) {
                    continue
                }
            }
            let currentX = x
            let currentY = y
            let currentValue = 0
            for (let i = 0; i < 10; i++) {
                currentX += directionTo.coordinates[0]
                currentY += directionTo.coordinates[1]
                currentValue += map.get(`${currentX},${currentY}`)
                if (map.has(`${currentX},${currentY}`) && i > 2) {
                    let isTargetNode = currentX === target[0] && currentY === target[1]
                    if (isTargetNode) {
                        graphNode[`${currentX},${currentY}`] = currentValue
                    } else {
                        graphNode[`${currentX},${currentY},${directionTo.direction}`] = currentValue
                    }
                }
            }
        }
        if (isStartNode) {
            graph[`${x},${y}`] = graphNode
        } else {
            graph[`${x},${y},${currentDirection.direction}`] = graphNode
        }
    }
}
