const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const ora = require('ora')

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


async function copyFile(filename, dstname, data) {
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

        return Promise.all(files.map(async file=>{
            const src = path.resolve(srcPath, file)
            const dst = path.resolve(dstPath, file)

            await copyTpl(src, dst, data)
        }))
    } else {
        await copyFile(srcPath, dstPath, data)

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
    const spinner = ora('devDependencies adding...\n')
    spinner.start();

    return new Promise((resolve, reject) => {
        const npmInstall = spawn('npm', ['i', '-D', ...deps], { shell: true });

        npmInstall.stdout.pipe(process.stdout)
        npmInstall.stderr.pipe(process.stderr)

        npmInstall.on('close', (code) => {
            if (code === 0) {
                resolve()
                spinner.succeed('devDependencies add SUCCESS!');

            } else {
                reject()
                spinner.fail('devDependencies add FAILED!');
            }
        });

    })
}

module.exports = {
    appname,
    relativePath,
    copyTpl,
    addDevDependencies
}