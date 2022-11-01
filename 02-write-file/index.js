const readline = require('node:readline');
const path = require('node:path');
const fs = require('fs');

const { stdin: input, stdout } = require('node:process');
const output = fs.createWriteStream(path.join(__dirname, 'destination.txt'));

const rl = readline.createInterface({ input });

stdout.write('Hi - type something please)!\n');

rl.on('line', data => { 
  if(data === 'exit') {
    process.exit();
  } else {
    output.write(data);
  }
});


process.on('exit', () => stdout.write('Good-bye Human!:) See you later!)'));

process.on('SIGINT', () => process.exit());