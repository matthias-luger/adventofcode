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
        } else {
            blockIndex += block.size
        }
    }
    return sum
}

function defrag(blocks) {
    let movingId = blocks[blocks.length - 1].id
    while (movingId >= 0) {
        let movingPosition = blocks.findIndex(b => b.id === movingId)
        let movingBlock = blocks[movingPosition]
        let freePosition = getNextFreePosition(blocks, movingBlock.size)
        let freeBlock = blocks[freePosition]
        if (!freeBlock || !movingBlock || freePosition >= movingPosition) {
            movingId -= 1
            continue
        }
        if (freeBlock.size > movingBlock.size) {
            freeBlock.size -= movingBlock.size
            blocks.splice(movingPosition, 1, {
                free: true,
                size: movingBlock.size
            })
            blocks.splice(freePosition, 0, movingBlock)
        } else if (freeBlock.size === movingBlock.size) {
            blocks.splice(movingPosition, 1, {
                free: true,
                size: movingBlock.size
            })
            blocks.splice(freePosition, 1, {
                free: false,
                size: freeBlock.size,
                id: movingBlock.id
            })
        }
        movingId -= 1
    }
}

function getNextFreePosition(blocks, minSize = 0) {
    let i = 0
    while (i < blocks.length && (blocks[i].free === false || blocks[i].size < minSize)) {
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
