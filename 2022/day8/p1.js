const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let split = data.split('\r\n')
    let trees = []
    let num = 0

    split.forEach((value, y) => {
        let row = []
        for (let x = 0; x < value.length; x++) {
            row.push(value[x])
        }
        trees.push(row)
    })

    for (let x = 0; x < trees[0].length; x++) {
        for (let y = 0; y < trees.length; y++) {
            if (checkIfVisible(trees, x, y)) {
                num++
            }
        }
    }

    console.log(num)
})

function checkIfVisible(trees, treeX, treeY) {
    let height = trees[treeY][treeX]

    let fromLeft = true
    for (let x = 0; x < treeX; x++) {
        if (height <= trees[treeY][x]) {
            fromLeft = false
        }
    }

    let fromRight = true
    for (let x = trees[0].length - 1; x > treeX; x--) {
        if (height <= trees[treeY][x]) {
            fromRight = false
        }
    }

    let fromTop = true
    for (let y = 0; y < treeY; y++) {
        if (height <= trees[y][treeX]) {
            fromTop = false
        }
    }

    let fromBottom = true
    for (let y = trees[0].length - 1; y > treeY; y--) {
        if (height <= trees[y][treeX]) {
            fromBottom = false
        }
    }
    return fromLeft || fromTop || fromRight || fromBottom
}
