const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let trees = []

    split.forEach((value, y) => {
        let row = []
        for (let x = 0; x < value.length; x++) {
            row.push(value[x])
        }
        trees.push(row)
    })

    let max = 0
    for (let x = 0; x < trees[0].length; x++) {
        for (let y = 0; y < trees.length; y++) {
            let score = getScenicScore(trees, x, y)
            if (score > max) {
                max = score
            }
        }
    }
    console.log(max)
})

function getScenicScore(trees, treeX, treeY) {
    let height = trees[treeY][treeX]

    let fromLeft = 0
    for (let x = treeX - 1; x >= 0; x--) {
        fromLeft++
        if (height <= trees[treeY][x]) {
            break
        }
    }

    let fromRight = 0
    for (let x = treeX + 1; x < trees[0].length; x++) {
        fromRight++
        if (height <= trees[treeY][x]) {
            break
        }
    }

    let fromTop = 0
    for (let y = treeY - 1; y >= 0; y--) {
        fromTop++
        if (height <= trees[y][treeX]) {
            break
        }
    }

    let fromBottom = 0
    for (let y = treeY + 1; y < trees[0].length; y++) {
        fromBottom++
        if (height <= trees[y][treeX]) {
            break
        }
    }
    return fromLeft * fromRight * fromTop * fromBottom
}
