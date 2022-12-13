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

    let dividerA = [[2]]
    let dividerB = [[6]]

    packages.push(dividerA, dividerB)
    packages.sort(compare)

    let indexA
    let indexB

    packages.forEach((package, i) => {
        if (package === dividerA) {
            indexA = i + 1
        }
        if (package === dividerB) {
            indexB = i + 1
        }
    })

    console.log(indexA * indexB)
})

function compare(left, right) {
    function compareInts(left, right) {
        if (left < right) {
            return -1
        }
        if (left === right) {
            return 0
        }
        if (left > right) {
            return 1
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
