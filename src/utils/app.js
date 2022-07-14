const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const { stat, mkdir, readdir } = require('fs/promises');
const { spawn } = require('child_process');
function appname() {
    return path.basename(process.cwd())
}
function relativePath(dirname) {
    return (basename) => {
        return path.resolve(dirname, basename)
    }

}

const copyPromises = new Set()
function copyFile(srcPath, dstPath, data) {
    const p = __copyFile(srcPath, dstPath, data)

    copyPromises.add(p)
}
async function __copyFile(filename, dstname, data) {
    const file = await ejs.renderFile(filename, data, { async: true })

    await enableDir(path.dirname(dstname))
    const ws = fs.createWriteStream(dstname)
    ws.write(file)
    ws.end()
}

async function copyTpl(srcPath, dstPath, data) {
    const stats = await stat(srcPath)

    if (stats.isDirectory()) {
        const files = await readdir(srcPath);

        for (const file of files) {
            const src = path.resolve(srcPath, file)
            const dst = path.resolve(dstPath, file)

            copyTpl(src, dst, data)
        }
    } else {
        copyFile(srcPath, dstPath, data)

    }
}

async function enableDir(name) {
    const dirname = path.dirname(name)
    if (name === dirname) return

    await enableDir(dirname)

    try {
        await mkdir(name)

    } catch (error) { }

}


function addDevDependencies(...deps) {
    return Promise.all([...copyPromises]).then(() => {
        return new Promise((resolve, reject) => {
            const npmInstall = spawn('npm', ['i', '-D', ...deps], { shell: true });

            npmInstall.stdout.pipe(process.stdout)
            npmInstall.stderr.pipe(process.stderr)

            npmInstall.on('close', (code) => {
                if (code === 0) {
                    resolve()
                } else {
                    reject()
                }
            });

        })
    })

}

module.exports = {
    appname,
    relativePath,
    copyTpl,
    addDevDependencies
}