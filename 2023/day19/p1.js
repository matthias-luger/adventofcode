const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let [workflows, values] = parseWorkflows(lines)

    let acceptedValueMaps = []
    for (valueMap of values) {
        let currentWorkflow = workflows['in']
        while (true) {
            let result = currentWorkflow.execute(valueMap)
            if (result === 'A' || result === 'R') {
                if (result === 'A') {
                    acceptedValueMaps.push(valueMap)
                }
                break
            } else {
                currentWorkflow = workflows[result]
            }
        }
    }

    let sum = 0
    for (const valueMap of acceptedValueMaps) {
        Object.values(valueMap).forEach(value => {
            sum += value
        })
    }
    console.log(sum)
})

function parseWorkflows(workflows) {
    let map = {}
    let values = []

    let isParsingWorkflows = true
    workflows.forEach(workflow => {
        if (workflow === '') {
            isParsingWorkflows = false
            return
        }

        if (isParsingWorkflows) {
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
                rules,
                execute: function (values) {
                    let result = null
                    for (const rule of rules) {
                        result = rule(values)
                        if (result !== null) {
                            break
                        }
                    }
                    return result
                }
            }
        } else {
            workflow = workflow.replace(/\{/g, '{"')
            workflow = workflow.replace(/\,/g, ',"')
            workflow = workflow.replace(/\=/g, '"=')
            values.push(JSON.parse(workflow.replace(/\=/g, ':')))
        }
    })

    return [map, values]
}

function parseRule(rule) {
    let isLast = !rule.includes(':')
    if (isLast) {
        return () => rule
    }
    let containsGreater = rule.includes('>')
    let containsLess = rule.includes('<')

    let [letter, right, result] = rule.split(/<|>|:/g)
    right = parseInt(right)

    return function (values) {
        if (containsGreater) {
            if (values[letter] > right) {
                return result
            } else {
                return null
            }
        }
        if (containsLess) {
            if (values[letter] < right) {
                return result
            } else {
                return null
            }
        }
    }
}
