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

    let dirs = getDirectoriesBySize(filesystem, size => size < 100000)
    let sum = 0
    dirs.forEach(dir => (sum += dir.size))
    console.log(sum)
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
                if (compareFunction(size)) {
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
