#!/usr/bin/env node

import * as program from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';

program
  .version('0.0.1', '-v, --version')
  .command('node:remove-node_modules <dir>')
  .option(
    '-p, --pickup',
    'Interactively pickup which directories to remove from a displayed list'
  )
  .action((dir, cmd) => {
    const searchDir = 'node_modules';
    const foundDirs: string[] = _findDirectoriesRecursivelyByName(
      searchDir,
      dir
    );
    console.log('found: ', foundDirs);
    if (foundDirs.length === 0) {
      console.log(
        `No directory named ${searchDir} has been founded in ${dir} directory.`
      );
      return;
    }

    console.log(
      `List of directories named ${searchDir} has been founded in ${dir} directory:`
    );
    foundDirs.forEach((dir, i) => {
      console.log(`${i + 1}. ${dir}`);
    });
    foundDirs.forEach(dirPath => {
      fs.removeSync(dirPath);
      console.log(`Removed ${dirPath}`);
    });
  });

function _findDirectoriesRecursivelyByName(searchDir: string, inDir: string) {
  const result: string[] = [];
  const filesAndFolders = fs.readdirSync(inDir, { withFileTypes: true });
  filesAndFolders.forEach(item => {
    if (item.isDirectory() && item.name[0] !== '.') {
      const subDirPath = path.join(inDir, item.name);
      if (item.name === searchDir) {
        result.push(subDirPath);
      } else {
        const resultInSubDir = _findDirectoriesRecursivelyByName(
          searchDir,
          subDirPath
        );
        resultInSubDir.forEach(item => result.push(item));
      }
    }
  });
  return result;
}

program.parse(process.argv);
