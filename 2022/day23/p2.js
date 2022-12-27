const fs = require('fs')
const ELF = '#'

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let elfSet = parseElfs(data)
    let moveConsiderations = ['N', 'S', 'W', 'E']
    let moved = true
    let i = 0
    while (moved) {
        i++
        moved = moveElfs(elfSet, moveConsiderations)
        turnMoveConsiderations(moveConsiderations)
    }
    console.log(i)
})

function paint(elfs) {
    let [minX, minY, maxX, maxY] = getRectCoordinates(elfs)
    console.log('-------------------------------')
    for (let y = minY; y <= maxY; y++) {
        let line = ''
        for (let x = minX; x <= maxX; x++) {
            if (elfs.has(x + ':' + y)) {
                line += ELF
            } else {
                line += '.'
            }
        }
        console.log(line)
    }
}

function getRectCoordinates(elfSet) {
    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity

    for (const elf of elfSet.keys()) {
        let [x, y] = elf.split(':').map(v => parseInt(v))

        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
    }

    return [minX, minY, maxX, maxY]
}

function moveElfs(elfSet, moveConsiderations) {
    let moved = false
    let plannedMoves = new Map()
    for (const elf of elfSet.keys()) {
        let [x, y] = elf.split(':').map(v => parseInt(v))

        let move = getProposedMove({ x, y }, elfSet, moveConsiderations)
        if (move) {
            if (!plannedMoves.has(move.x + ':' + move.y)) {
                plannedMoves.set(move.x + ':' + move.y, { amount: 1, elf })
            } else {
                plannedMoves.set(move.x + ':' + move.y, { amount: plannedMoves.get(move.x + ':' + move.y).amount + 1 })
            }
        }
    }

    for (const moveIterator of plannedMoves) {
        let [key, move] = moveIterator
        if (move.amount === 1) {
            moved = true
            elfSet.delete(move.elf)
            elfSet.add(key)
        }
    }
    return moved
}

function getProposedMove(currElf, elfSet, moveConsiderations) {
    let nearOtherElfs = {
        NW: elfSet.has(currElf.x - 1 + ':' + (currElf.y - 1)),
        N: elfSet.has(currElf.x + ':' + (currElf.y - 1)),
        NE: elfSet.has(currElf.x + 1 + ':' + (currElf.y - 1)),
        E: elfSet.has(currElf.x + 1 + ':' + currElf.y),
        SE: elfSet.has(currElf.x + 1 + ':' + (currElf.y + 1)),
        S: elfSet.has(currElf.x + ':' + (currElf.y + 1)),
        SW: elfSet.has(currElf.x - 1 + ':' + (currElf.y + 1)),
        W: elfSet.has(currElf.x - 1 + ':' + currElf.y)
    }

    if (
        !Object.keys(nearOtherElfs)
            .map(k => nearOtherElfs[k])
            .includes(true)
    ) {
        return null
    }

    let move = null
    moveConsiderations.forEach(moveConsideration => {
        if (move) {
            return
        }
        switch (moveConsideration) {
            case 'N':
                if (!nearOtherElfs['N'] && !nearOtherElfs['NE'] && !nearOtherElfs['NW']) {
                    move = { x: currElf.x, y: currElf.y - 1 }
                }
                break
            case 'E':
                if (!nearOtherElfs['E'] && !nearOtherElfs['SE'] && !nearOtherElfs['NE']) {
                    move = { x: currElf.x + 1, y: currElf.y }
                }
                break
            case 'S':
                if (!nearOtherElfs['S'] && !nearOtherElfs['SE'] && !nearOtherElfs['SW']) {
                    move = { x: currElf.x, y: currElf.y + 1 }
                }
                break
            case 'W':
                if (!nearOtherElfs['W'] && !nearOtherElfs['NW'] && !nearOtherElfs['SW']) {
                    move = { x: currElf.x - 1, y: currElf.y }
                }
                break
        }
    })
    return move
}

function parseElfs(data) {
    let elfSet = new Set()
    let split = data.split('\r\n')

    split.forEach((value, y) => {
        for (let x = 0; x < value.length; x++) {
            if (value[x] === ELF) {
                elfSet.add(x + ':' + y)
            }
        }
    })

    return elfSet
}

function turnMoveConsiderations(moveConsiderations) {
    let first = moveConsiderations.shift()
    moveConsiderations.push(first)
}
