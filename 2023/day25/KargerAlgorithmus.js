// This is a Implementation of Karger's Algorithm to find the minimum cut of a graph
// It is modified so the merged nodes' names are also merged together and make the name of the new node
// This is necessary to find the 2 remaining super-nodes (meaning the circles after the cuts)

class Graph {
    constructor(vertices) {
        this.vertices = vertices
        this.edges = []
    }

    addEdge(u, v) {
        this.edges.push([u, v])
    }

    contractEdge(edgeIndex) {
        const [u, v] = this.edges[edgeIndex]
        this.vertices--

        this.edges.splice(edgeIndex, 1)

        let mergedName = `${u},${v}`
        for (let i = 0; i < this.edges.length; i++) {
            const [x, y] = this.edges[i]
            if (x === v) this.edges[i][0] = mergedName
            if (y === v) this.edges[i][1] = mergedName

            if (x === u) this.edges[i][0] = mergedName
            if (y === u) this.edges[i][1] = mergedName
        }

        this.edges = this.edges.filter(([x, y]) => x !== y)
    }

    kargerMinCut() {
        while (this.vertices > 2) {
            const randomEdgeIndex = Math.floor(Math.random() * this.edges.length)
            this.contractEdge(randomEdgeIndex)
        }

        return this.edges
    }
}

module.exports = Graph
