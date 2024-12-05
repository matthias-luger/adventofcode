const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let [rules, updates] = buildRulesAndUpdates(data)
    let validUpdatesAfterFix = []

    for (let update of updates) {
        let isInitiallyValid = checkRule(rules, update)
        if (!isInitiallyValid) {
            let pos = 0
            let swapPos = 0
            while (pos < update.length - 1) {
                let isPosValid = checkRulesForPos(rules, update, pos)
                while (!isPosValid) {
                    swap(update, pos, swapPos)
                    isPosValid = checkRulesForPos(rules, update, pos)
                    if (!isPosValid) {
                        swapPos++
                    }
                }
                pos++
                swapPos = pos
            }
            validUpdatesAfterFix.push(update)
        }
    }

    let sum = 0
    for (let validUpdate of validUpdatesAfterFix) {
        sum += validUpdate[(validUpdate.length - 1) / 2]
    }
    console.log(sum)
})

function checkRule(rules, update) {
    for (let rule of rules) {
        let indexUpdate1 = update.indexOf(rule[0])
        let indexUpdate2 = update.indexOf(rule[1])

        if (indexUpdate1 === -1 || indexUpdate2 === -1) {
            continue
        }
        if (indexUpdate1 > indexUpdate2) {
            return false
        }
    }
    return true
}

function checkRulesForPos(rules, update, updatePos) {
    for (let rule of rules) {
        if (update[updatePos] === rule[0]) {
            let indexUpdate2 = update.indexOf(rule[1])
            if (indexUpdate2 === -1) {
                continue
            }
            if (updatePos > indexUpdate2) {
                return false
            }
        }
        if (update[updatePos] === rule[1]) {
            let indexUpdate1 = update.indexOf(rule[0])
            if (indexUpdate1 === -1) {
                continue
            }
            if (indexUpdate1 > updatePos) {
                return false
            }
        }
    }
    return true
}

function swap(array, a, b) {
    let temp = array[a]
    array[a] = array[b]
    array[b] = temp
}

function buildRulesAndUpdates(data) {
    let lines = data.split('\r\n')

    let updates = []
    let rules = []
    let isOnUpdates = false
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line === '') {
            isOnUpdates = true
            continue
        }

        if (isOnUpdates) {
            updates.push(line.split(',').map(n => parseInt(n)))
        } else {
            let [from, to] = line.split('|').map(n => parseInt(n))
            rules.push([from, to])
        }
    }
    return [rules, updates]
}
