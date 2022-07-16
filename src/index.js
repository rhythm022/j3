#! /usr/bin/env node
// require('events').defaultMaxListeners = 70;
const { Command } = require('commander')
const { scaffold } = require('./scaffold')


const program = new Command()
program
  .name('dev-utils')
  .description('CLI to some Development utilities')
  .version('0.0.1');

program.command('yo')
    .description('scaffold')
    .action(() => {
        scaffold()
    })

program.parse()