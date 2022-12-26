const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let blueprints = []
    lines.forEach((line, i) => {
        let blueprint = {}
        let splits = line.split(' ')
        blueprint.id = i + 1
        blueprint.oreRobotCost = { ore: parseInt(splits[6]) }
        blueprint.clayRobotCost = { ore: parseInt(splits[12]) }
        blueprint.obsidianRobotCost = {
            ore: parseInt(splits[18]),
            clay: parseInt(splits[21])
        }
        blueprint.geodeRobotCost = {
            ore: parseInt(splits[27]),
            obsidian: parseInt(splits[30])
        }
        blueprints.push(blueprint)
    })

    let bestRoutes = []
    for (let i = 0; i < 3; i++) {
        let best = getMaxGeodesInTime(blueprints[i], 32)
        bestRoutes.push(best)
    }

    console.log(bestRoutes.reduce((prev, curr) => prev * curr.resources.geode, 1))
})

function getMaxGeodesInTime(blueprint, time) {
    let queue = [
        { timeLeft: time, robots: { ore: 1, clay: 0, obsidian: 0, geode: 0 }, resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 }, finished: false, path: [] }
    ]
    let max = null
    let earliestGeodeTimeLeft = Infinity
    let bestSet = new Map()

    while (queue.length > 0) {
        let currState = queue.pop()
        if (currState.timeLeft <= 0) {
            currState.finished = true
        }
        if (currState.finished) {
            if (!max || currState.resources.geode > max.resources.geode) {
                max = currState
            }
            continue
        }
        currState.timeLeft--
        if (currState.robots.geode > 0 && currState.timeLeft > earliestGeodeTimeLeft) {
            earliestGeodeTimeLeft = currState.timeLeft
        }
        let futureStates = generateFutureStates(blueprint, currState, earliestGeodeTimeLeft)
        for (let i = futureStates.length - 1; i >= 0; i--) {
            let check = futureStates[i]
            if (!bestSet.has(check.timeLeft) || isBetter(check, bestSet.get(check.timeLeft))) {
                bestSet.set(check.timeLeft, JSON.parse(JSON.stringify(check)))
            }
            if (isBetter(bestSet.get(check.timeLeft), check)) {
                futureStates.splice(i, 1)
            }
        }
        queue.push(...futureStates)
    }
    return max
}

function isBetter(stateA, stateB) {
    return (
        stateA.robots.ore >= stateB.robots.ore &&
        stateA.robots.clay >= stateB.robots.clay &&
        stateA.robots.obsidian >= stateB.robots.obsidian &&
        stateA.robots.geode >= stateB.robots.geode &&
        stateA.resources.ore > stateB.resources.ore &&
        stateA.resources.clay > stateB.resources.clay &&
        stateA.resources.obsidian > stateB.resources.obsidian &&
        stateA.resources.geode > stateB.resources.geode
    )
}

function generateFutureStates(blueprint, state, earliestGeode) {
    let futureStates = []
    if (isPossibleFuture(state, blueprint, earliestGeode, 'ore')) {
        futureStates.push(getNewState(state, blueprint, 'ore'))
    }
    if (isPossibleFuture(state, blueprint, earliestGeode, 'clay')) {
        futureStates.push(getNewState(state, blueprint, 'clay'))
    }
    if (isPossibleFuture(state, blueprint, earliestGeode, 'obsidian')) {
        futureStates.push(getNewState(state, blueprint, 'obsidian'))
    }
    if (isPossibleFuture(state, blueprint, earliestGeode, 'geode')) {
        futureStates.push(getNewState(state, blueprint, 'geode'))
    }
    if (futureStates.length < 2 && isPossibleFuture(state, blueprint, earliestGeode, 'none')) {
        futureStates.push(getNewState(state, blueprint, 'none'))
    }
    return futureStates
}

function getNewState(state, blueprint, action) {
    let newState = {
        timeLeft: state.timeLeft,
        robots: { ...state.robots },
        resources: { ...state.resources },
        finished: state.finished,
        path: [...state.path]
    }
    generateResources(newState)
    if (action === 'ore') {
        newState.resources.ore -= blueprint.oreRobotCost.ore
        newState.robots.ore++
    }
    if (action === 'clay') {
        newState.resources.ore -= blueprint.clayRobotCost.ore
        newState.robots.clay++
    }
    if (action === 'obsidian') {
        newState.resources.ore -= blueprint.obsidianRobotCost.ore
        newState.resources.clay -= blueprint.obsidianRobotCost.clay
        newState.robots.obsidian++
    }
    if (action === 'geode') {
        newState.resources.ore -= blueprint.geodeRobotCost.ore
        newState.resources.obsidian -= blueprint.geodeRobotCost.obsidian
        newState.robots.geode++
    }
    newState.path.push(action)
    return newState
}

function isPossibleFuture(state, blueprint, earliestGeode, action) {
    let costs = {
        ore: 0,
        clay: 0,
        obsidian: 0
    }

    if (state.timeLeft > earliestGeode && state.robots.geode === 0 && action !== 'geode') {
        return false
    }

    if (action === 'ore') {
        // has already more ore robots than anything can cost
        if (state.timeLeft < 16) {
            return false
        }
        costs.ore += blueprint.oreRobotCost.ore
    }
    if (action === 'clay') {
        if (state.timeLeft < 7) {
            return false
        }
        if (state.robots.clay >= blueprint.obsidianRobotCost.clay) {
            return false
        }
        costs.ore += blueprint.clayRobotCost.ore
    }
    if (action === 'obsidian') {
        if (state.timeLeft < 3) {
            return false
        }
        if (state.robots.obsidian >= blueprint.geodeRobotCost.obsidian) {
            return false
        }
        costs.ore += blueprint.obsidianRobotCost.ore
        costs.clay += blueprint.obsidianRobotCost.clay
    }
    if (action === 'geode') {
        if (state.timeLeft < 1) {
            return false
        }
        costs.ore += blueprint.geodeRobotCost.ore
        costs.obsidian += blueprint.geodeRobotCost.obsidian
    }
    return costs.ore <= state.resources.ore && costs.clay <= state.resources.clay && costs.obsidian <= state.resources.obsidian
}

function generateResources(state) {
    state.resources.ore += state.robots.ore
    state.resources.clay += state.robots.clay
    state.resources.obsidian += state.robots.obsidian
    state.resources.geode += state.robots.geode
}
