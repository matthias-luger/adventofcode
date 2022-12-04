const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let sum = 0

    split.forEach(value => {
        let part1 = value.substring(0, value.length / 2)
        let part2 = value.substring(value.length / 2, value.length)
        let foundChar = ''

        for (let i = 0; i < part1.length; i++) {
            const char = part1[i]
            if (part2.includes(char)) {
                foundChar = char
            }
        }

        sum += foundChar.toLowerCase() === foundChar ? foundChar.charCodeAt(0) - 96 : foundChar.charCodeAt(0) - 38
    })

    console.log(sum)
})
