#! /usr/bin/env node
// require('events').defaultMaxListeners = 70;
const { Command } = require('commander')
const { scaffold } = require('./scaffold')


const program = new Command()

program
    .version('0.1.0')
    .description('scaffold')
    .command('yo')
    .action(() => {
        scaffold()
    })


program.parse(process.argv)