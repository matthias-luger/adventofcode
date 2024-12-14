const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let robots = parseRobots(lines)

    let width = 101
    let height = 103

    let seconds = 0
    while (true) {
        seconds++
        for (let robot of robots) {
            robot.p.x += robot.v[0]
            robot.p.y += robot.v[1]
            robot.p.x = robot.p.x % width
            robot.p.y = robot.p.y % height
            if (robot.p.x < 0) robot.p.x = width + robot.p.x
            if (robot.p.y < 0) robot.p.y = height + robot.p.y
        }

        let toughing = numberOfRobotsTouchingAtLeastOnOtherRobot(robots)

        // paint all robots, if a lot of them are touching at least on other robot
        // paint that picture and check for the tree
        if (toughing >= robots.length / 2) {
            paint(robots, width, height)
            console.log(toughing)
            console.log(seconds)
            debugger
            console.clear()
        }
    }
})

function paint(robots, width, height) {
    for (let i = 0; i < height; i++) {
        let row = ''
        for (let j = 0; j < width; j++) {
            let robot = robots.find(robot => robot.p.x === j && robot.p.y === i)
            row += robot ? '#' : '.'
        }
        console.log(row)
    }
}

function numberOfRobotsTouchingAtLeastOnOtherRobot(robots) {
    function areToughing(robotA, robotB) {
        let xDiff = Math.abs(robotA.p.x - robotB.p.x)
        let yDiff = Math.abs(robotA.p.y - robotB.p.y)
        return xDiff <= 1 && yDiff <= 1
    }

    let numberTouging = 0
    for (let i = 0; i < robots.length; i++) {
        let isToughing = false
        for (let j = 0; j < robots.length; j++) {
            if (i !== j && areToughing(robots[i], robots[j])) {
                isToughing = true
            }
        }
        if (isToughing) numberTouging++
    }
    return numberTouging
}

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
