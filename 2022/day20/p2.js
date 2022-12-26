const fs = require('fs')

const key = 811589153

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let list = []
    split.forEach((value, i) => {
        list.push({ value: parseInt(value) * 811589153, originalIndex: i })
    })

    for (let mix = 0; mix < 10; mix++) {
        for (let i = 0; i < list.length; i++) {
            let listIndex = list.findIndex(entry => entry.originalIndex === i)
            let value = list[listIndex].value
            list.splice(listIndex, 1)
            list.splice((listIndex + value) % list.length, 0, { value, originalIndex: i })
        }
    }

    let indexOfZero = list.findIndex(e => e.value === 0)

    let sum = 0
    for (let i = 1000; i <= 3000; i += 1000) {
        sum += list[(indexOfZero + i) % list.length].value
    }
    console.log(sum)
})
