const path = require('path');
const { readdir, unlink } = require('node:fs/promises');
const fs = require('fs');
const { truncate } = require('node:fs/promises');

async function createBundle() {
  const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });

  let promiseArr = [];

  filterFiles = files.filter(file => file.isFile());

  await filterFiles.forEach(file => {
    let ext = file.name.split('.');
    if (ext[ext.length - 1] === 'css') {
      let promise = new Promise((res, rej) => {
        const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
        let str = '';
        readableStream.on('data', chunk => str += chunk);
        readableStream.on('end', () => res(str));
      });
      promiseArr.push(promise);
    }
  })

  let styleArr = await Promise.all(promiseArr);
  console.log(styleArr);

  const projectDistFiles = await readdir(path.join(__dirname, 'project-dist'));

  for( let file of projectDistFiles) {
    if(file.name === 'bundle.css') {
      unlink(path.join(__dirname, 'project-dist', file.name));
    }
  }

  const toBundle = fs.createWriteStream(path.join(__dirname,'project-dist', 'bundle.css'));

  // await truncate(path.join(__dirname,'project-dist', 'bundle.css'),0);

  
  styleArr.forEach(item => toBundle.write(item));

}

createBundle();