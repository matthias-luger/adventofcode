const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    let filesystem = {}
    let currPath = '/'

    let lines = data.split('\r\n')
    lines.forEach(line => {
        let parts = line.split(' ')
        if (parts[0] === '$') {
            if (parts[1] === 'cd') {
                currPath = getCurrPath(currPath, parts[2])
            }
        } else {
            if (parts[0] !== 'dir') {
                currPath = getCurrPath(currPath, parts[1])
                setValueForPath(filesystem, currPath, parseInt(parts[0]))
                currPath = getCurrPath(currPath, '..')
            }
        }
    })

    let all = getDirectoriesBySize(filesystem)
    let root = all.find(directory => directory.name === '/')

    const TOTAL_SPACE = 70000000
    const UPDATE_SIZE = 30000000
    const UNUSED_SPACE = TOTAL_SPACE - root.size
    const TO_FREE = UPDATE_SIZE - UNUSED_SPACE

    let toDelete = null
    all.forEach(dir => {
        if (dir.size >= TO_FREE && (toDelete === null || toDelete.size > dir.size)) {
            toDelete = dir
        }
    })
    console.log(toDelete.size)
})

function getCurrPath(path, newValue) {
    if (newValue === '/') {
        return '/'
    }
    let splits = path.split('/')
    if (newValue === '..') {
        splits.pop()
        return splits.join('/')
    }
    return `${path}${path[path.length - 1] !== '/' ? '/' : ''}${newValue}`
}

function setValueForPath(obj, path, value) {
    var schema = obj
    var pList = path.split('/')
    pList.shift()
    pList.unshift('/')
    var len = pList.length
    for (var i = 0; i < len - 1; i++) {
        var elem = pList[i]
        if (!schema[elem]) schema[elem] = {}
        schema = schema[elem]
    }
    schema[pList[len - 1]] = value
}

function getDirectoriesBySize(directory, compareFunction) {
    let foundDirectories = []

    function getDirectorySize(directory) {
        let directorySize = 0
        Object.keys(directory).forEach(key => {
            let element = directory[key]
            if (typeof element === 'number') {
                directorySize += element
            } else {
                let size = getDirectorySize(element)
                if (!compareFunction || compareFunction(size)) {
                    foundDirectories.push({ name: key, size: size })
                }
                directorySize += size
            }
        })
        return directorySize
    }
    getDirectorySize(directory)
    return foundDirectories
}
