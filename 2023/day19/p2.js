const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let workflows = parseWorkflows(lines)

    let positiveResults = getPossibleSuccessfullPathsForWorkflow(workflows)

    let conditionsArr = []
    positiveResults.forEach(positiveResult => {
        let conditions = {}
        positiveResult.rules.forEach(rule => {
            if (!rule.letter) return
            if (!conditions[rule.letter]) {
                conditions[rule.letter] = {
                    min: 1,
                    max: 4000
                }
            }
            if (rule.symbol === '>') {
                conditions[rule.letter].min = Math.max(conditions[rule.letter].min, rule.value + 1)
            } else {
                conditions[rule.letter].max = Math.min(conditions[rule.letter].max, rule.value - 1)
            }
        })
        let letters = ['x', 'm', 'a', 's']
        letters.forEach(letter => {
            if (!conditions[letter]) {
                conditions[letter] = {
                    min: 1,
                    max: 4000
                }
            }
        })
        conditionsArr.push(conditions)
    })

    let sum = 0
    for (const conditions of conditionsArr) {
        let conditionsAmount = 1
        Object.keys(conditions).forEach(key => {
            conditionsAmount *= conditions[key].max - conditions[key].min + 1
        })
        sum += conditionsAmount
    }
    console.log(sum)
})

function getPossibleSuccessfullPathsForWorkflow(workflows) {
    let paths = [
        {
            rules: [],
            workflow: workflows['in']
        }
    ]

    let endedPaths = []

    while (paths.length) {
        let currentPath = paths.shift()

        let currentWorkflow = currentPath.workflow

        currentWorkflow.rules.forEach(rule => {
            let positiveResult = rule.positiveResult

            if (positiveResult === 'A' || positiveResult === 'R') {
                if (positiveResult === 'A') {
                    let newRules = [...currentPath.rules]
                    newRules.push(rule)

                    endedPaths.push({
                        rules: newRules
                    })
                }
            } else {
                let newRules = [...currentPath.rules]
                newRules.push(rule)
                let newWorkflow = workflows[positiveResult]

                paths.push({
                    rules: newRules,
                    workflow: newWorkflow
                })
            }

            let newRule = { ...rule }
            if (rule.symbol === '>') {
                newRule.symbol = '<'
                newRule.value = rule.value + 1
            } else {
                newRule.symbol = '>'
                newRule.value = rule.value - 1
            }

            currentPath.rules.push(newRule)
        })
    }

    return endedPaths
}

function parseWorkflows(workflows) {
    let map = {}

    workflows.forEach(workflow => {
        if (workflow === '') {
            return map
        }

        let parts = workflow.split('{')

        let name = parts[0].trim()
        let rest = parts[1].replace(/\}/g, '')

        let rules = []
        rulesString = rest.split(',')

        rulesString.forEach((rule, i) => {
            if (i === rulesString.lines - 1) return

            rules.push(parseRule(rule))
        })

        map[name] = {
            rules
        }
    })

    return map
}

function parseRule(rule) {
    let isLast = !rule.includes(':')
    if (isLast) {
        return {
            execute: () => rule,
            rule: rule,
            positiveResult: rule
        }
    }
    let containsGreater = rule.includes('>')

    let [letter, right, result] = rule.split(/<|>|:/g)
    right = parseInt(right)

    return {
        rule: rule,
        letter: letter,
        symbol: containsGreater ? '>' : '<',
        value: right,
        positiveResult: result
    }
}
