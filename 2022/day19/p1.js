const fs = require('fs')

fs.readFile('./sample.txt', 'utf8', (err, data) => {
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

    console.log(getMaxGeodesInTime(blueprints[0], 24))
})

function getMaxGeodesInTime(blueprint, time) {
    let queue = [{ timeLeft: time, robots: { ore: 1, clay: 0, obsidian: 0, geode: 0 }, resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 }, finished: false }]
    let max = 0

    while (queue.length > 0) {
        let currState = queue.shift()
        if (currState.timeLeft <= 0) {
            currState.finished = true
        }
        if (currState.finished) {
            if (currState.resources.geode > max) {
                max = currState.resources.geode
            }
            continue
        }
        currState.timeLeft--
        let futureStates = generateFutureStates(blueprint, currState)
        queue.push(...futureStates)

        for (let i = queue.length - 1; i >= 0; i--) {
            let a = queue[i]
            for (let j = 0; j < futureStates.length; j++) {
                let b = futureStates[j]
                if (
                    a.timeLeft === b.timeLeft &&
                    a.robots.clay <= b.robots.clay &&
                    a.robots.ore <= b.robots.ore &&
                    a.robots.obsidian <= b.robots.obsidian &&
                    a.robots.geode <= b.robots.geode &&
                    a.resources.ore < b.resources.ore &&
                    a.resources.clay < b.resources.clay &&
                    a.resources.obsidian < b.resources.obsidian &&
                    a.resources.geode < b.resources.geode
                ) {
                    queue.splice(i, 1)
                }
            }
        }
    }
    return max
}
function generateFutureStates(blueprint, state) {
    let futureStates = []
    if()
    futureStates.push(getNewState(state, blueprint, false, false, false, false))

    if (
        state.resources.ore > state.timeLeft * blueprint.oreRobotCost.ore &&
        state.resources.ore > state.timeLeft * blueprint.clayRobotCost.ore &&
        state.resources.ore > state.timeLeft * blueprint.obsidianRobotCost.ore &&
        state.resources.ore > state.timeLeft * blueprint.geodeRobotCost.ore
    ) {
        return []
    }
    if (state.resources.clay > state.timeLeft * blueprint.obsidianRobotCost.clay) {
        return []
    }
    if (state.resources.obsidian > state.timeLeft * blueprint.geodeRobotCost.obsidian) {
        return []
    }
    if (isPossibleFuture(state, blueprint, false, false, false, true)) {
        futureStates.push(getNewState(state, blueprint, false, false, false, true))
    }
    if (isPossibleFuture(state, blueprint, false, false, true, false)) {
        futureStates.push(getNewState(state, blueprint, false, false, true, false))
    }
    if (isPossibleFuture(state, blueprint, false, true, false, false)) {
        futureStates.push(getNewState(state, blueprint, false, true, false, false))
    }
    if (isPossibleFuture(state, blueprint, true, false, false, false)) {
        futureStates.push(getNewState(state, blueprint, true, false, false, false))
    }
    return futureStates
}

function getNewState(state, blueprint, buyOreRobot, buyClayRobot, buyObsidianRobot, buyGeodeRobot) {
    let newState = JSON.parse(JSON.stringify(state))
    if (buyOreRobot) {
        newState.resources.ore -= blueprint.oreRobotCost.ore
        newState.robots.ore++
    }
    if (buyClayRobot) {
        newState.resources.ore -= blueprint.clayRobotCost.ore
        newState.robots.clay++
    }
    if (buyObsidianRobot) {
        newState.resources.ore -= blueprint.obsidianRobotCost.ore
        newState.resources.clay -= blueprint.obsidianRobotCost.clay
        newState.robots.obsidian++
    }
    if (buyGeodeRobot) {
        newState.resources.ore -= blueprint.geodeRobotCost.ore
        newState.resources.clay -= blueprint.geodeRobotCost.clay
        newState.resources.obsidian -= blueprint.geodeRobotCost.obsidian
        newState.robots.geode++
    }
    generateResources(newState)
    return newState
}

function isPossibleFuture(state, blueprint, buyOreRobot, buyClayRobot, buyObsidianRobot, buyGeodeRobot) {
    let costs = {
        ore: 0,
        clay: 0,
        obsidian: 0
    }
    if (buyOreRobot) {
        // has already more ore robots than anything can cost
        if (
            state.robots.ore >= blueprint.oreRobotCost.ore &&
            state.robots.ore >= blueprint.clayRobotCost.ore &&
            state.robots.ore >= blueprint.obsidianRobotCost.ore &&
            state.robots.ore >= blueprint.geodeRobotCost.ore
        ) {
            return false
        }
        costs.ore += blueprint.oreRobotCost.ore
    }
    if (buyClayRobot) {
        if (state.robots.clay >= blueprint.obsidianRobotCost.clay) {
            return false
        }
        costs.ore += blueprint.clayRobotCost.ore
    }
    if (buyObsidianRobot) {
        if (state.robots.obsidian >= blueprint.geodeRobotCost.obsidian) {
            return false
        }
        costs.ore += blueprint.obsidianRobotCost.ore
        costs.clay += blueprint.obsidianRobotCost.clay
    }
    if (buyGeodeRobot) {
        costs.ore += blueprint.geodeRobotCost.ore
        costs.obsidian += blueprint.geodeRobotCost.obsidian
    }
    return costs.ore <= state.resources.ore && costs.clay <= state.resources.clay && costs.obsidian <= state.resources.obsidian
}

function generateResources(state) {
    Object.keys(state.robots).forEach(robotKey => {
        state.resources[robotKey] += state.robots[robotKey]
    })
}
