const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let list1 = []
    let list2 = []

    for (let i = 0; i < lines.length; i++) {
        let split = lines[i].split('   ')
        list1.push(split[0])
        list2.push(split[1])
    }

    list1.sort((a, b) => a - b)
    list2.sort((a, b) => a - b)

    let distances = list1.map((val, i) => Math.abs(val - list2[i]))
    let total = distances.reduce((acc, val) => acc + val)
    console.log(total)
})
