const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let [rules, updates] = buildRulesAndUpdates(data)
    let validUpdates = []

    for (let update of updates) {
        let isValid = true
        for (let rule of rules) {
            let indexUpdate1 = update.indexOf(rule[0])
            let indexUpdate2 = update.indexOf(rule[1])

            if (indexUpdate1 === -1 || indexUpdate2 === -1) {
                continue
            }
            if (indexUpdate1 > indexUpdate2) {
                isValid = false
                break
            }
        }
        if (isValid) {
            validUpdates.push(update)
        }
    }

    let sum = 0
    for (let validUpdate of validUpdates) {
        sum += validUpdate[(validUpdate.length - 1) / 2]
    }
    console.log(sum)
})

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
