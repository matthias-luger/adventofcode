const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let nodesMap = {}
    lines.forEach(line => {
        let name = line.split('Valve ')[1].split(' has ')[0]
        let rate = +line.split('flow rate=')[1].split(';')[0]
        let leadsTo = line.indexOf('to valves ') !== -1 ? line.split('to valves ')[1].split(', ') : [line.split('to valve ')[1]]

        nodesMap[name] = { leadsTo, rate, name }
    })

    console.log(findPossiblePaths(nodesMap, 30)[0].pressure)
})

function getActiveNodes(nodesMap) {
    return Object.keys(nodesMap)
        .map(key => nodesMap[key])
        .filter(node => node.rate > 0)
}

function getDistances(nodes, startName) {
    let distances = {}
    if (nodes[startName].distanceMap) {
        return nodes[startName].distanceMap
    }
    function calcDistances(name, steps) {
        if (distances[name] != undefined && distances[name] <= steps) {
            return
        }
        distances[name] = steps
        nodes[name].leadsTo.forEach(n => calcDistances(n, steps + 1))
    }
    calcDistances(startName, 0)
    nodes[startName].distanceMap = distances
    return distances
}

function findPossiblePaths(nodesMap, time) {
    let paths = [{ curr: 'AA', active: getActiveNodes(nodesMap).map(n => n.name), timeLeft: time, finished: false, path: [], pressure: 0 }]
    let max = 0

    for (let n = 0; n < paths.length; n++) {
        let path = paths[n]
        if (path.timeLeft <= 0) {
            path.finished = true
        }
        if (path.finished) {
            continue
        }

        let distances = getDistances(nodesMap, path.curr)
        let moved = false

        path.active.forEach(act => {
            if (act == path.curr || path.timeLeft - distances[act] <= 1) {
                return true
            }
            moved = true
            paths.push({
                curr: act,
                active: path.active.filter(v => v != act),
                timeLeft: path.timeLeft - distances[act] - 1,
                finished: false,
                path: [...path.path, act],
                pressure: path.pressure + (path.timeLeft - distances[act] - 1) * nodesMap[act].rate
            })
        })
        if (!moved) {
            path.finished = true
        }
        if (path.finished && path.pressure > max) {
            max = path.pressure
        }
    }

    return paths.filter(p => p.finished).sort((a, b) => b.pressure - a.pressure)
}
