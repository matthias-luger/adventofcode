function dijkstra(graph, start, target) {
    let fullyExplored = new Set()
    let toExploreMap = new Map()
    let toExploreQueue = [{ distance: 0, key: start, paths: { ...graph[start] } }]

    let pathMap = new Map()

    let node = toExploreQueue[0]
    while (node.key !== target) {
        fullyExplored.add(node.key)
        Object.keys(node.paths).forEach(key => {
            if (fullyExplored.has(key)) {
                return
            }
            let distance = node.paths[key] + node.distance

            let oldDistance = toExploreMap.get(key)
            if (oldDistance) {
                if (oldDistance > distance) {
                    let node = toExploreQueue.find(v => v.key === key)
                    node.distance = distance

                    toExploreQueue.sort((a, b) => a.distance - b.distance)
                    toExploreMap.set(key, distance)
                    pathMap.set(key, node.key)
                }
            } else {
                toExploreQueue.push({
                    key,
                    distance,
                    paths: { ...graph[key] }
                })

                toExploreQueue.sort((a, b) => a.distance - b.distance)
                toExploreMap.set(key, distance)
                pathMap.set(key, node.key)
            }
        })
        node = toExploreQueue.shift()
        if (!node) {
            return {
                distance: Infinity,
                shortestPath: null
            }
        }
    }

    return {
        distance: toExploreMap.get(target)
    }
}

module.exports = {
    dijkstra
}
