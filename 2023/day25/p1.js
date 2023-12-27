const fs = require('fs')
const Graph = require('./KargerAlgorithmus')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let numberOfNodes = getNumberOfNodes(lines)

    let [circleA, circleB] = getCircles(lines, numberOfNodes, 3)

    console.log(circleA.size * circleB.size)
})

function getCircles(lines, numberOfNodes, targetNumberOfCuts) {
    // We execute Kargers Algorithm until we have a a with the target number of cuts (or below)
    // This result contains 2 super nodes, which are the circles that result after the target number of cuts
    let superNodes
    while (!superNodes || superNodes.entries().next().value[1].length > targetNumberOfCuts) {
        let graph = parseKargerGraph(lines, numberOfNodes)
        let erg = graph.kargerMinCut()

        superNodes = new Map()
        erg.forEach(e => {
            if (!superNodes.has(e[0])) superNodes.set(e[0], [])
            superNodes.set(e[0], [...superNodes.get(e[0]), e[1]])

            if (!superNodes.has(e[1])) superNodes.set(e[1], [])
            superNodes.set(e[1], [...superNodes.get(e[1]), e[0]])
        })
    }

    let superNodesArr = Array.from(superNodes.keys())
    let circleA = new Set(superNodesArr[0].split(','))
    let circleB = new Set(superNodesArr[1].split(','))

    return [circleA, circleB]
}

function parseKargerGraph(lines, vertices) {
    let graph = new Graph(vertices)

    for (const line of lines) {
        let [key, connectionsString] = line.split(':')
        connectionsString = connectionsString.trim()
        let connections = connectionsString.split(' ')
        for (const connection of connections) {
            graph.addEdge(key, connection)
        }
    }
    return graph
}

function getNumberOfNodes(lines) {
    let set = new Set()

    for (const line of lines) {
        let [key, connectionsString] = line.split(':')
        set.add(key)

        connectionsString = connectionsString.trim()
        let connections = connectionsString.split(' ')

        for (const connection of connections) {
            set.add(connection)
        }
    }
    return set.size
}
