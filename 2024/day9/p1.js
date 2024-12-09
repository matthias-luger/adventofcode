const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let blocks = parseBlocks(data)
    defrag(blocks)
    console.log(calculateChecksum(blocks))
})

function calculateChecksum(blocks) {
    let sum = 0
    let blockIndex = 0
    for (const block of blocks) {
        if (block.free === false) {
            for (let i = 0; i < block.size; i++) {
                sum += block.id * blockIndex
                blockIndex++
            }
        }
    }
    return sum
}

function defrag(blocks) {
    let freePosition = getNextFreePosition(blocks)
    let movingPosition = blocks.length - 1
    while (freePosition < movingPosition) {
        let movingBlock = blocks[movingPosition]
        let freeBlock = blocks[freePosition]

        if (!freeBlock || !movingBlock) {
            break
        }
        if (freeBlock.size > movingBlock.size) {
            freeBlock.size -= movingBlock.size
            blocks.splice(movingPosition, 1)
            blocks.push({
                free: true,
                size: movingBlock.size
            })
            blocks.splice(freePosition, 0, movingBlock)
        } else {
            let restSize = movingBlock.size - freeBlock.size
            movingBlock.size = restSize

            if (movingBlock.size === 0) {
                blocks.splice(movingPosition, 1)
            }

            blocks.splice(freePosition, 1, {
                free: false,
                size: freeBlock.size,
                id: movingBlock.id
            })
            blocks.push({ ...freeBlock })
        }
        freePosition = getNextFreePosition(blocks)
        movingPosition = getNextMovingPosition(blocks)
    }
}

function getNextMovingPosition(blocks) {
    let i = blocks.length - 1
    while (i >= 0 && blocks[i].free === true) {
        i--
    }
    return i
}

function getNextFreePosition(blocks) {
    let i = 0
    while (i < blocks.length && blocks[i].free === false) {
        i++
    }
    return i
}

function parseBlocks(line) {
    let blocks = []
    let id = 0
    for (let i = 0; i < line.length; i += 2) {
        let block = line[i]
        let freeSpace = line[i + 1]

        blocks.push({
            id: id,
            free: false,
            size: parseInt(block)
        })
        if (freeSpace) {
            blocks.push({
                free: true,
                size: parseInt(freeSpace)
            })
        }
        id++
    }
    return blocks
}
