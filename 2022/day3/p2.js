const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let sum = 0
    let backpacks = []

    split.forEach(value => {
        backpacks.push(value)
        if (backpacks.length === 3) {
            let foundChar = ''
            for (let i = 0; i < backpacks[0].length; i++) {
                const char = backpacks[0][i]
                if (backpacks[1].indexOf(char) !== -1 && backpacks[2].indexOf(char) !== -1) {
                    foundChar = char
                }
            }
            sum += foundChar.toLowerCase() === foundChar ? foundChar.charCodeAt(0) - 96 : foundChar.charCodeAt(0) - 38
            backpacks = []
        }
    })

    console.log(sum)
})
