const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let graph = buildGraph(lines)
    let result = findLargestNetwork(graph)
    console.log(result.sort().join(','))
})

function findLargestNetwork(graph) {
    let largestNetwork = []

    for (const parent of graph) {
        let n = getNetwork(graph, parent[0], [])
        if (n.length > largestNetwork.length) {
            largestNetwork = n
        }
    }

    return largestNetwork
}

let cache = new Map()
function getNetwork(graph, node, network) {
    if (cache.has(node)) {
        return cache.get(node)
    }
    if (network.includes(node)) {
        return
    }
    for (const networkMember of network) {
        if (!graph.get(node).includes(networkMember)) {
            return null
        }
    }
    let newNetwork = [...network, node]
    let largestNetwork = newNetwork
    for (const child of graph.get(node)) {
        let n = getNetwork(graph, child, newNetwork)
        if (n && n.length > largestNetwork.length) {
            largestNetwork = n
        }
    }
    cache.set(node, largestNetwork)
    return largestNetwork
}

function buildGraph(lines) {
    let graph = new Map()
    for (const line of lines) {
        let [from, to] = line.split('-')
        if (!graph.has(from)) {
            graph.set(from, [])
        }
        graph.get(from).push(to)

        if (!graph.has(to)) {
            graph.set(to, [])
        }
        graph.get(to).push(from)
    }
    return graph
}
