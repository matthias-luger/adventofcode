const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    for (let i = 13; i < data.length - 1; i++) {
        if (!checkForDuplicates(data.substring(i - 13, i + 1))) {
            console.log(i + 1)
            return
        }
    }
})

function checkForDuplicates(string) {
    let duplicate = false
    for (let i = 0; i < string.length; i++) {
        const element = string[i]
        if (string.lastIndexOf(element) !== i || string.indexOf(element) !== i) {
            duplicate = true
        }
    }
    return duplicate
}
