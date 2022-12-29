const fs = require('fs')
const WALL = '#'
const FREE = '.'
const PLAYER = '@'

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let winds = split.slice(1, -1).map(line => line.substring(1, line.length - 1))
    let start = { x: 0, y: -1 }
    let target = { x: winds[0].length - 1, y: winds.length }

    let queue = [{ player: start, steps: 0, path: [] }]
    let visited = new Set()
    let minSteps = Infinity
    while (queue.length > 0) {
        let current = queue.shift()

        if (current.steps > minSteps) {
            continue
        }
        if (current.player.x === target.x && current.player.y === target.y) {
            minSteps = Math.min(minSteps, current.steps)
            continue
        }

        let nextStates = []
        if (canMove(current.player.x, current.player.y, current.steps + 1, winds, start, target, visited)) {
            nextStates.push({
                player: { x: current.player.x, y: current.player.y },
                steps: current.steps + 1,
                path: [...current.path, 'STAY']
            })
        }
        if (canMove(current.player.x, current.player.y + 1, current.steps + 1, winds, start, target, visited)) {
            nextStates.push({
                player: { x: current.player.x, y: current.player.y + 1 },
                steps: current.steps + 1,
                path: [...current.path, 'DOWN']
            })
        }
        if (canMove(current.player.x, current.player.y - 1, current.steps + 1, winds, start, target, visited)) {
            nextStates.push({
                player: { x: current.player.x, y: current.player.y - 1 },
                steps: current.steps + 1,
                path: [...current.path, 'UP']
            })
        }
        if (canMove(current.player.x + 1, current.player.y, current.steps + 1, winds, start, target, visited)) {
            nextStates.push({
                player: { x: current.player.x + 1, y: current.player.y },
                steps: current.steps + 1,
                path: [...current.path, 'RIGHT']
            })
        }
        if (canMove(current.player.x - 1, current.player.y, current.steps + 1, winds, start, target, visited)) {
            nextStates.push({
                player: { x: current.player.x - 1, y: current.player.y },
                steps: current.steps + 1,
                path: [...current.path, 'LEFT']
            })
        }
        nextStates.forEach(nextState => {
            let stateKey = nextState.player.x + ':' + nextState.player.y + ':' + (nextState.steps % ((nextState.player.x + 2) * (nextState.player.y + 2)))
            visited.add(stateKey)
            queue.push(nextState)
        })
    }
    console.log(minSteps)
})

function canMove(x, y, steps, winds, start, target, visited) {
    if ((x === target.x && y === target.y) || (x === start.x && y === start.y)) {
        return true
    }
    if (x < 0 || x >= winds[0].length || y < 0 || y >= winds.length) {
        return false
    }
    return !hasWind(x, y, steps, winds) && !visited.has(x + ':' + y + ':' + (steps % ((x + 2) * (y + 2))))
}

function hasWind(x, y, steps, winds) {
    return (
        winds[mod(y - steps, winds.length)][x] === 'v' ||
        winds[mod(y + steps, winds.length)][x] === '^' ||
        winds[y][mod(x - steps, winds[0].length)] === '>' ||
        winds[y][mod(x + steps, winds[0].length)] === '<'
    )
}

function mod(n, d) {
    return ((n % d) + d) % d
}
