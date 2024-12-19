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
        let number = getNumberOfPossibleCombinations(target, input.available, true)
        cache.clear()
        if (number) {
            sum += number
        }
    }
    console.log(sum)
})

let cache = new Map()
function getNumberOfPossibleCombinations(target, availables) {
    if (cache.has(target)) {
        return cache.get(target)
    }
    if (!target) {
        return 1
    }
    let sum = 0
    for (const combination of availables) {
        if (!target.startsWith(combination)) {
            continue
        }
        let newSum = getNumberOfPossibleCombinations(target.substring(combination.length), availables)
        sum += newSum
    }
    if (cache.has(target)) {
        cache.set(cache.get(target) + sum)
    } else {
        cache.set(target, sum)
    }
    return sum
}

function parseInput(lines) {
    let available = lines[0].split(', ')
    let targets = []
    for (let i = 2; i < lines.length; i++) {
        targets.push(lines[i])
    }
    return { available, targets }
}
