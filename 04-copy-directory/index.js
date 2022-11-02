const path = require('path');
const { mkdir, readdir, copyFile, unlink } = require('node:fs/promises');


async function copyDir() {
  let pathFrom = path.join(__dirname, 'files');
  let copyDirPath = path.join(__dirname, 'files-copy');
  const dirCreation = await mkdir(copyDirPath, { recursive: true });
  const oldFiles = await readdir(copyDirPath, {withFileTypes: true});

  for (let file of oldFiles) {
    console.log(file)
    if(file.name) {
      unlink(path.join(copyDirPath, file.name));
    }
  }

  const files = await readdir(pathFrom, { withFileTypes: true });
  for (let file of files) {
    copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
  }

}

copyDir();


