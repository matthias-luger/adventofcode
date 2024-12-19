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
        let isPossible = isPossibleCombination(target, input.available, true)
        cache.clear()
        if (isPossible) {
            sum++
        }
    }
    console.log(sum)
})

let cache = new Map()
function isPossibleCombination(target, availables) {
    if (cache.has(target)) {
        return cache.get(target)
    }
    if (!target) {
        return true
    }
    let isPossible = false
    for (const combination of availables) {
        if (!target.startsWith(combination)) {
            continue
        }
        if (isPossibleCombination(target.substring(combination.length), availables)) {
            isPossible = true
            break
        }
    }
    cache.set(target, isPossible)
    return isPossible
}

function parseInput(lines) {
    let available = lines[0].split(', ')
    let targets = []
    for (let i = 2; i < lines.length; i++) {
        targets.push(lines[i])
    }
    return { available, targets }
}
