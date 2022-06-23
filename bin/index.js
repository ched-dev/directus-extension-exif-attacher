#! /usr/bin/env node
const command = process.argv.slice(2)[0];
const commandRunners = {
  create: () => require('./create-data-model'),
  build: () => require('./build-hook-from-package')
}
const commandNames = Object.keys(commandRunners);
const availableCommandsText = `Available commands are ${commandNames.map(name => `\`${name}\``).join(' or ')}.`;

if (!command) {
  console.error(`Error: No command provided. ${availableCommandsText}`);
  process.exit(0);
}

if (!commandNames.includes(command)) {
  console.error(`Error: Command not found. ${availableCommandsText}`);
  process.exit(0);
}

console.log('> Running command:', command);
commandRunners[command]();