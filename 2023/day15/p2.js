const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let hash = string =>
        string.split('').reduce((sum, a) => {
            return ((sum + a.charCodeAt(0)) * 17) % 256
        }, 0)

    let boxes = {}

    let instructions = data.split(',')

    for (const instruction of instructions) {
        if (instruction.includes('-')) {
            let label = instruction.replace('-', '')
            let hashValue = hash(label)
            let box = boxes[hashValue]

            if (!box) {
                continue
            }
            boxes[hashValue] = boxes[hashValue].filter(box => !box.includes(label))
        }
        if (instruction.includes('=')) {
            let [label] = instruction.split('=')
            let hashValue = hash(label)
            let box = boxes[hashValue]

            if (!box) {
                boxes[hashValue] = [instruction]
                continue
            }
            let index = boxes[hashValue].findIndex(box => box.includes(label))
            if (index === -1) {
                boxes[hashValue].push(instruction)
            } else {
                boxes[hashValue][index] = instruction
            }
        }
    }

    let sum = 0
    Object.entries(boxes).forEach(([key, value]) => {
        value.forEach((box, i) => {
            sum += (parseInt(key) + 1) * (parseInt(i) + 1) * parseInt(box.split('=')[1])
        })
    })

    console.log(sum)
})
