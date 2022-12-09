const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')

    let head = { x: 0, y: 0 }
    let tail = { x: 0, y: 0 }
    let visited = {}
    lines.forEach(line => {
        let direction = line.split(' ')[0]
        let amount = line.split(' ')[1]

        for (let i = 0; i < amount; i++) {
            switch (direction) {
                case 'L':
                    head.x--
                    break
                case 'U':
                    head.y++
                    break
                case 'R':
                    head.x++
                    break
                case 'D':
                    head.y--
                    break
            }
            moveTail(head, tail)
            visited[tail.x + '|' + tail.y] = true
        }
    })
    console.log(Object.keys(visited).length)
})

function moveTail(head, tail) {
    if ((tail.x === head.x - 1 || tail.x === head.x + 1 || tail.x === head.x) && (tail.y === head.y - 1 || tail.y === head.y + 1 || tail.y === head.y)) {
        return
    }

    if (tail.x === head.x) {
        if (tail.y > head.y) {
            tail.y--
        } else {
            tail.y++
        }
    }
    if (tail.y === head.y) {
        if (tail.x > head.x) {
            tail.x--
        } else {
            tail.x++
        }
    }

    if (head.x > tail.x && head.y > tail.y) {
        tail.x++
        tail.y++
    }
    if (head.x > tail.x && head.y < tail.y) {
        tail.x++
        tail.y--
    }
    if (head.x < tail.x && head.y > tail.y) {
        tail.x--
        tail.y++
    }
    if (head.x < tail.x && head.y < tail.y) {
        tail.x--
        tail.y--
    }
}
