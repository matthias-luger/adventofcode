const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let input = parseInput(lines)

    let sum = 0
    for (const target of input.targets) {
        if (isBuildPossible(target, input.available)) {
            sum++
        }
    }
    console.log(sum)
})

function isBuildPossible(target, availables) {
    let combinations = availables.filter(a => target.startsWith(a)).map(a => ({ curr: a }))
    let availableCombinations = [...availables]
    let possibleCombinations = new Set()
    availableCombinations.forEach(a => possibleCombinations.add(a))

    while (combinations.length > 0) {
        let combination = combinations.pop()

        for (const available of availableCombinations) {
            let newCombination = combination.curr + available
            if (!target.startsWith(newCombination) || possibleCombinations.has(newCombination)) {
                continue
            }
            if (newCombination === target) {
                return true
            }
            possibleCombinations.add(combination.curr)
            combinations.push({ curr: newCombination })
        }
    }
}

function parseInput(lines) {
    let available = lines[0].split(', ')
    let targets = []
    for (let i = 2; i < lines.length; i++) {
        targets.push(lines[i])
    }
    return { available, targets }
}
