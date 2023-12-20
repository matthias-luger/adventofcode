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

    let lowPulsesSum = 0
    let highPulsesSum = 0
    for (let i = 0; i < 1000; i++) {
        let [lowPulses, highPulses] = simulateQueue(JSON.parse(JSON.stringify(queue)), modules)
        lowPulsesSum += lowPulses
        highPulsesSum += highPulses
    }

    console.log(lowPulsesSum * highPulsesSum)
})

function simulateQueue(queue, modules) {
    let lowPulses = 0
    let highPulses = 0
    while (queue.length > 0) {
        let { target, pulseType, source, isFinished } = queue.shift()

        if (pulseType === 'low') {
            lowPulses++
        }
        if (pulseType === 'high') {
            highPulses++
        }

        if (LOG_OUTPUT) {
            console.log(`${source.name} -${pulseType}- -> ${target.name}`)
        }

        if (isFinished) {
            continue
        }

        let result = triggerModule(source, target, pulseType)

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
    return [lowPulses, highPulses]
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
                    name: name
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
