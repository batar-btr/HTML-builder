const path = require('path');
const fs = require('fs');
const { mkdir, unlink, readdir, readFile, copyFile } = require('node:fs/promises');

async function htmlBuilder() {
  const projectDist = path.join(__dirname, 'project-dist');
  const indexHtml = path.join(__dirname, 'project-dist', 'index.html');
  const styleCss = path.join(__dirname, 'project-dist', 'style.css');
  const assetsPath = path.join(__dirname, 'project-dist', 'assets');

  await mkdir(projectDist, { recursive: true });
  await mkdir(assetsPath, { recursive: true });

  const oldFiles = await readdir(projectDist);

  const readableStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const writableStream = fs.createWriteStream(indexHtml);
  const writebleCSSStream = fs.createWriteStream(styleCss);

  let template = '';
  readableStream.on('data', chunk => template += chunk);
  readableStream.on('end', async () => {
    const components = await readdir(path.join(__dirname, 'components'));

    await Promise.all(components.map(async item => {
      let [name, ext] = item.split('.');
      if (ext === 'html') {
        let component = await readFile(path.join(__dirname, 'components', item), 'utf-8');
        template = template.replace(`{{${name}}}`, component)
      }
    }))
    writableStream.write(template);
  });

  const pathToStyles = path.join(__dirname, 'styles');
  const cssFiles = await readdir(pathToStyles, { withFileTypes: true });

  cssFiles.forEach(async (file) => {
    const isCss = path.extname(path.join(pathToStyles, file.name)) === '.css';
    if (file.isFile() && isCss) {
      let style = await readFile(path.join(pathToStyles, file.name), 'utf-8');
      writebleCSSStream.write(style);
    }
  })
  // ----------------------assets-----------------------------
  const copy = async (folder, dest) => {
    const dir = await readdir(folder, { withFileTypes: true });
    dir.forEach(async item => {
      if (item.isFile()) {
        await mkdir(dest, { recursive: true })
        await copyFile(path.join(folder, item.name), path.join(dest, item.name));
      } else if (item.isDirectory()) {
        copy(path.join(folder, item.name), path.join(dest, item.name))
      }
    })
  }
  copy(path.join(__dirname, 'assets'), assetsPath);
}



htmlBuilder();