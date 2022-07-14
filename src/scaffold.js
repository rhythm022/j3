const inquirer = require('inquirer');
const path = require('path');
const { appname, relativePath, copyTpl, addDevDependencies } = require('./utils/app');
const templatePath = relativePath(path.resolve(__dirname, 'templates'))
const destinationPath = relativePath(path.resolve(process.cwd()))

const promptList = [
    {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: appname()

    },
    {
        type: "input",
        name: "version",
        message: "Your project version",
        default: "0.0.1"
    },
    {
        type: "input",
        name: "description",
        message: "Your project description",
        default: ""
    }
];
async function scaffold() {
    const answers = await inquirer.prompt(promptList)
    copyTpl(
        templatePath('a.js'),
        destinationPath('src/a.js'),
        answers
    );
    copyTpl(
        templatePath('b.js'),
        destinationPath('src/b.js'),
        answers
    );
    copyTpl(
        templatePath('index.js'),
        destinationPath('src/index.js'),
        answers
    );

    copyTpl(
        templatePath('index.html'),
        destinationPath('src/index.html'),
        answers
    );
    copyTpl(
        templatePath('test'),
        destinationPath('test'),
        answers
    );
    copyTpl(
        templatePath('package.json'),
        destinationPath('package.json'),
        answers
    );
    copyTpl(
        templatePath('webpack.config.js'),
        destinationPath('webpack.config.js'),
        answers
    );
    copyTpl(
        templatePath('babel.config.json'),
        destinationPath('babel.config.json'),
        answers
    );
    copyTpl(
        templatePath('.nycrc'),
        destinationPath('.nycrc'),
        answers
    );
    copyTpl(
        templatePath('.eslintrc.js'),
        destinationPath('.eslintrc.js'),
        answers
    );

    await addDevDependencies(
        '@babel/core',
        '@babel/preset-env',
        'babel-loader',
        'webpack-cli',
        'copy-webpack-plugin',
        'http-server',
        'mocha',
        '@babel/register',
        'nyc',
        'babel-plugin-istanbul',
        '@istanbuljs/nyc-config-babel',
        'eslint'
    )
}


module.exports = {
    scaffold
}