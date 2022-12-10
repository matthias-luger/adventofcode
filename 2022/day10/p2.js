const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let cycle = 0
    let x = 1
    let sum = 0
    let drawing = []

    split.forEach(line => {
        let splits = line.split(' ')
        if (splits[0] === 'addx') {
            cycle++
            sum += checkCycle(x, drawing)
            cycle++
            sum += checkCycle(x, drawing)
            x += +splits[1]
        } else {
            cycle++
            sum += checkCycle(x, drawing)
        }
    })
    draw(drawing)
})

function checkCycle(x, drawing) {
    let cursorX = drawing.length % 40
    if (cursorX === x || cursorX === x - 1 || cursorX === x + 1) {
        drawing.push('#')
    } else {
        drawing.push('.')
    }
    return 0
}

function draw(drawing) {
    let pos = 0
    while (pos < drawing.length) {
        let line = ''
        for (let i = 0; i < 40; i++) {
            line += drawing[pos]
            pos++
        }
        console.log(line)
    }
}
