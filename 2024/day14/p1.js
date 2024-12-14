const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let robots = parseRobots(lines)
    console.log(robots)

    let width = 101
    let height = 103

    let seconds = 100
    for (let i = 0; i < seconds; i++) {
        for (let robot of robots) {
            robot.p.x += robot.v[0]
            robot.p.y += robot.v[1]
        }
    }

    let quadrants = [[], [], [], []]
    for (const robot of robots) {
        robot.p.x = robot.p.x % width
        robot.p.y = robot.p.y % height

        if (robot.p.x < 0) robot.p.x = width + robot.p.x
        if (robot.p.y < 0) robot.p.y = height + robot.p.y

        let midX = Math.floor(width / 2)
        let midY = Math.floor(height / 2)

        if (robot.p.x < midX && robot.p.y < midY) quadrants[0].push(robot)
        if (robot.p.x > midX && robot.p.y < midY) quadrants[1].push(robot)
        if (robot.p.x < midX && robot.p.y > midY) quadrants[2].push(robot)
        if (robot.p.x > midX && robot.p.y > midY) quadrants[3].push(robot)
    }

    let sum = 1
    for (const quadrant of quadrants) {
        sum *= quadrant.length
    }
    console.log(sum)
})

function parseRobots(lines) {
    let robots = []
    for (let line of lines) {
        let [p, v] = line.split(' v=')
        let [x, y] = p.split('p=')[1].split(',').map(Number)
        p = { x, y }
        v = v.split(',').map(Number)
        robots.push({ p, v })
    }
    return robots
}
