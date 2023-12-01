const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let calibrationNumbersSum = 0
    let stringToValues = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9
    }

    lines.forEach(line => {
        if (line === '') return

        let lastIndex = -Infinity
        let firstIndex = Infinity
        let lastValue
        let firstValue

        Object.keys(stringToValues).forEach(key => {
            function checkAndSetIndex(index) {
                if (index !== -1) {
                    if (firstIndex > index) {
                        firstIndex = index
                        firstValue = stringToValues[key]
                    }
                    if (lastIndex < index) {
                        lastIndex = index
                        lastValue = stringToValues[key]
                    }
                }
            }
            let index = line.indexOf(key)
            let index2 = line.lastIndexOf(key)
            checkAndSetIndex(index)
            checkAndSetIndex(index2)
        })

        console.log(`${line} => ${firstValue}${lastValue}`)

        calibrationNumbersSum += parseInt(`${firstValue}${lastValue}`)
    })

    console.log(calibrationNumbersSum)
})
