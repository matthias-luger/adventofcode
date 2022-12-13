const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')

    let packages = []

    split.forEach(value => {
        if (value !== '') {
            packages.push(JSON.parse(value))
        }
    })

    let results = []
    for (let i = 0; i < packages.length; i += 2) {
        let left = packages[i]
        let right = packages[i + 1]
        let result = compare(left, right)
        results.push(result)
    }

    let sum = 0
    results.forEach((result, i) => {
        if (result === 1) {
            sum += i + 1
        }
    })
    console.log(sum)
})

function compare(left, right) {
    function compareInts(left, right) {
        if (left < right) {
            return 1
        }
        if (left === right) {
            return 0
        }
        if (left > right) {
            return -1
        }
    }
    if (typeof left === 'number' && typeof right === 'number') {
        return compareInts(left, right)
    }
    if (typeof left === 'object' && typeof right === 'object') {
        for (let i = 0; i < left.length; i++) {
            if (i < right.length) {
                let result = compare(left[i], right[i])
                if (result !== 0) {
                    return result
                }
            }
        }
        return compareInts(left.length, right.length)
    }
    if (typeof left === 'number') {
        left = [left]
    }
    if (typeof right === 'number') {
        right = [right]
    }
    return compare(left, right)
}
