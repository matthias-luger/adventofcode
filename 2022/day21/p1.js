const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let monkeyMap = new Map()

    lines.forEach(line => {
        let name = line.split(':')[0]
        let split = line.split(' ')
        let getYell = function () {
            if (!isNaN(+split[1])) {
                return +split[1]
            }
            let name1 = split[1]
            let name2 = split[3]
            let operator = split[2]

            return eval(`${monkeyMap.get(name1)()} ${operator} ${monkeyMap.get(name2)()}`)
        }
        monkeyMap.set(name, getYell)
    })

    console.log(monkeyMap.get('root')())
})
