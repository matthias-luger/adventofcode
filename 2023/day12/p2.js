const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let result = 0
    lines.map(line => {
        let [row, numbers] = line.split(' ')
        row = Array(5).fill(row).join('?')
        numbers = Array(5).fill(numbers).join(',').split(',').map(Number)
        result += countWays(row, numbers)
    })
    console.log(result)
})

let cache = new Map()
function countWays(row, ns) {
    row = row.replace(/^\.+|\.+$/, '')
    if (row === '') {
        return ns.length ? 0 : 1
    }
    if (!ns.length) {
        return row.includes('#') ? 0 : 1
    }
    let key = [row, ns].join(':')
    if (cache.has(key)) {
        return cache.get(key)
    }

    let result = 0
    const damaged = row.match(/^#+(?=\.|$)/)
    if (damaged) {
        if (damaged[0].length === ns[0]) {
            result += countWays(row.slice(ns[0]), ns.slice(1))
        }
    } else if (row.includes('?')) {
        let total = 0
        ns.forEach(n => {
            total += n
        })
        result += countWays(row.replace('?', '.'), ns)
        if ((row.match(/#/g) || []).length < total) {
            result += countWays(row.replace('?', '#'), ns)
        }
    }
    cache.set(key, result)
    return result
}
