const fs = require('fs')
const { init } = require('z3-solver')

fs.readFile('./input.txt', 'utf8', async (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let lines = data.split('\r\n')
    let hailstones = lines.map(parseHailstone)
    let res = await getStartingCoordinates(hailstones)
    console.log(res)
    return
})

async function getStartingCoordinates(allHailstones) {
    // The input is constructed in a way that there will be one possible "lucky shot"
    // So if we find a solution for the first three, it should work for the rest of the stones as well
    let hailStones = allHailstones.splice(0, 3)

    const { Context } = await init()
    const Z3 = Context('main')

    const x = Z3.Real.const('x')
    const y = Z3.Real.const('y')
    const z = Z3.Real.const('z')

    const vx = Z3.Real.const('vx')
    const vy = Z3.Real.const('vy')
    const vz = Z3.Real.const('vz')

    const solver = new Z3.Solver()

    for (let i = 0; i < hailStones.length; i++) {
        const stone = hailStones[i]
        const t = Z3.Real.const(`t${i}`)

        solver.add(x.add(vx.mul(t)).eq(t.mul(stone.vx).add(stone.x)))
        solver.add(y.add(vy.mul(t)).eq(t.mul(stone.vy).add(stone.y)))
        solver.add(z.add(vz.mul(t)).eq(t.mul(stone.vz).add(stone.z)))
    }

    const isSat = await solver.check()

    if (isSat !== 'sat') return -1

    const model = solver.model()
    const rx = Number(model.eval(x))
    const ry = Number(model.eval(y))
    const rz = Number(model.eval(z))

    return rx + ry + rz
}

function parseHailstone(line) {
    let [coordinates, velocity] = line.split('@')
    let [x, y, z] = coordinates.trim().split(',')
    let [vx, vy, vz] = velocity.trim().split(',')

    return {
        x: parseInt(x),
        y: parseInt(y),
        z: parseInt(z),
        vx: parseInt(vx),
        vy: parseInt(vy),
        vz: parseInt(vz),
        m: parseInt(vy) / parseInt(vx)
    }
}
