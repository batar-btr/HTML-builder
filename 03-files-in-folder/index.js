
const path = require('path');
const fs = require('fs');
const { readdir } = require('node:fs/promises');

const show = async function (pathToFile) {
  try {
    const files = await readdir(pathToFile, { withFileTypes: true });
    for (const file of files)
      if (file.isFile()) {
        let [name, ext] = file.name.split('.');
        fs.stat(
          path.join(pathToFile, file.name),
          (err, stats) => console.log(`${name} - ${ext} - ${stats.size / 1024}Kb`));
      }
  } catch (err) {
    console.error(err);
  }
}
show(path.join(__dirname, 'secret-folder'));