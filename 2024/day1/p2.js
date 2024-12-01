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

    let result = 0
    for (let i = 0; i < list1.length; i++) {
        let occourances = 0
        for (let j = 0; j < list2.length; j++) {
            if (list1[i] === list2[j]) {
                occourances++
            }
        }
        result += list1[i] * occourances
    }

    console.log(result)
})
