const path = require('path');
const fs = require('fs');
const { stdout } = process;

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let str = '';

readableStream.on('data', chunk => str += chunk);
readableStream.on('end', () => stdout.write(str));