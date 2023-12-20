const fs = require('fs')

LOG_OUTPUT = false

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let modules = parseModules(data.split('\r\n'))

    let queue = [
        {
            target: modules['broadcaster'],
            source: { name: 'button' },
            pulseType: 'low'
        }
    ]

    /**
     * This assumes that the last module "rx" is connected to one conjunction which in itself is connected to 4 conjunctions. Each of these 4 conjuctions are cycles that take a certain amount of ticks to go through.
     * First we find these 4 conjuctions and then we find the least common multiple of the amount of ticks it takes for each of them to go through a cycle.
     * This is the value returned by the "simulateQueueAndFindCycles" function below.
     */
    let modulesToFindCyclesFor = []
    for (const module in modules) {
        if (modules[module].targets.includes('rx')) {
            let secondToLastModule = module

            for (const module2 in modules) {
                if (modules[module2].targets.includes(secondToLastModule)) {
                    modulesToFindCyclesFor.push(modules[module2])
                }
            }
            break
        }
    }

    let iteration = 0
    let result
    while (true) {
        iteration++
        result = simulateQueueAndFindCycles(JSON.parse(JSON.stringify(queue)), modules, iteration, modulesToFindCyclesFor)
        if (result) {
            break
        }
    }

    console.log(result)
})

function simulateQueueAndFindCycles(queue, modules, iteration, modulesToFindCyclesFor) {
    while (queue.length > 0) {
        let { target, pulseType, source, isFinished } = queue.shift()

        if (target.name === 'rx' && pulseType === 'low') {
            return true
        }

        if (LOG_OUTPUT) {
            console.log(`${source.name} -${pulseType}- -> ${target.name}`)
        }

        if (isFinished) {
            continue
        }

        let result = triggerModule(source, target, pulseType)

        if (modulesToFindCyclesFor.find(module => module.name === target.name) && result[0].pulseType === 'high') {
            modules[target.name].triggerCycle.push(iteration)

            if (modulesToFindCyclesFor.every(e => e.triggerCycle.length > 0)) {
                return findLeastCommonMultipleOfList(modulesToFindCyclesFor.map(e => e.triggerCycle[0]))
            }
        }

        if (result) {
            result.forEach(r => {
                let targetModule = modules[r.target]
                if (targetModule) {
                    r.target = targetModule
                } else {
                    r.target = { name: r.target }
                    r.isFinished = true
                }
            })
            queue.push(...result)
        }
    }
    return false
}

function triggerModule(sourceModule, targetModule, pulseType) {
    let targetType = targetModule.type
    switch (targetType) {
        case '%':
            if (pulseType === 'high') {
                return
            }
            if (pulseType === 'low') {
                let result = targetModule.targets.map(t => {
                    return {
                        target: t,
                        source: targetModule,
                        pulseType: targetModule.state === 'on' ? 'low' : 'high'
                    }
                })
                targetModule.state = targetModule.state === 'on' ? 'off' : 'on'
                return result
            }
            break
        case '&':
            targetModule.rememberedPulses[sourceModule.name] = pulseType

            let areAllHigh = Object.values(targetModule.rememberedPulses).every(value => value === 'high')

            return targetModule.targets.map(t => {
                return {
                    target: t,
                    source: targetModule,
                    pulseType: areAllHigh ? 'low' : 'high'
                }
            })
            break
        case 'broadcaster':
            return targetModule.targets.map(t => {
                return {
                    target: t,
                    source: targetModule,
                    pulseType: pulseType
                }
            })
            break
    }
}

function parseModules(lines) {
    let modules = {}

    let conjuctionModules = []

    lines.forEach(line => {
        let [nameString, targetsString] = line.split(' -> ')
        let targets = targetsString.split(', ')

        if (nameString === 'broadcaster') {
            modules['broadcaster'] = {
                targets: targets,
                type: 'broadcaster',
                name: 'broadcaster'
            }
        } else {
            let type = nameString.charAt(0)
            let name = nameString.substring(1)
            if (type === '%') {
                modules[name] = {
                    type: type,
                    targets: targets,
                    state: 'off',
                    name: name
                }
            }
            if (type === '&') {
                conjuctionModules.push(name)
                modules[name] = {
                    type: type,
                    targets: targets,
                    rememberedPulses: {},
                    name: name,
                    triggerCycle: []
                }
            }
        }
    })

    conjuctionModules.forEach(name => {
        Object.entries(modules).forEach(([key, value]) => {
            if (value.targets.includes(name)) {
                modules[name].rememberedPulses[key] = 'low'
            }
        })
    })

    return modules
}

function greatestCommonDivisor(a, b) {
    return b === 0 ? a : greatestCommonDivisor(b, a % b)
}

function leastCommonMultiple(a, b) {
    return (a * b) / greatestCommonDivisor(a, b)
}

function findLeastCommonMultipleOfList(arr) {
    let result = 1
    for (let i = 0; i < arr.length; i++) {
        result = leastCommonMultiple(result, arr[i])
    }
    return result
}
