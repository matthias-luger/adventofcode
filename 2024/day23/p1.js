const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let graph = buildGraph(lines)
    let result = findGroupsOfThree(graph)
    let withT = result.filter(r => {
        let [a, b, c] = r
        return a.startsWith('t') || b.startsWith('t') || c.startsWith('t')
    })
    console.log(withT.length)
})

function findGroupsOfThree(graph) {
    let groups = []
    let found = new Set()
    for (const parent of graph) {
        for (const child of parent[1]) {
            for (const grandChild of graph.get(child)) {
                if (grandChild !== parent[0] && graph.get(grandChild).includes(parent[0]) && !found.has(`${parent[0]}-${child}-${grandChild}`)) {
                    groups.push([parent[0], child, grandChild])
                    found.add(`${parent[0]}-${child}-${grandChild}`)
                    found.add(`${parent[0]}-${grandChild}-${child}`)
                    found.add(`${child}-${parent[0]}-${grandChild}`)
                    found.add(`${child}-${grandChild}-${parent[0]}`)
                    found.add(`${grandChild}-${child}-${parent[0]}`)
                    found.add(`${grandChild}-${parent[0]}-${child}`)
                }
            }
        }
    }
    return groups
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
