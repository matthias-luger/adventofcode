const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let safeLines = 0

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        let chars = line.split(' ').map(ch => parseInt(ch))
        let valid = true
        let direction = chars[0] > chars[1] ? 'DESC' : 'ASC'

        for (let j = 1; j < chars.length; j++) {
            if (direction === 'ASC' && chars[j - 1] > chars[j]) {
                valid = false
                break
            }
            if (direction === 'DESC' && chars[j - 1] < chars[j]) {
                valid = false
                break
            }

            const stepA = chars[j - 1]
            const stepB = chars[j]
            let diff = Math.abs(stepA - stepB)

            if (diff > 3 || diff === 0) {
                valid = false
                break
            }
        }

        if (valid) {
            safeLines++
        }
    }

    console.log(safeLines)
})
