'use strict';

const fg = require('fast-glob');
const fs = require('fs');
const SilentError = require('silent-error');
const getCompressedSize = require('./compressed-size');

function getFileSize(file, compression) {
  let contentsBuffer = fs.readFileSync(file);
  return getCompressedSize(contentsBuffer, compression);
}

function combineSizes(fileSizes) {
  return fileSizes.reduce((result, fileSize) => result + fileSize, 0);
}

module.exports = function getBundlesize(pattern, buildDir, compression) {
  return fg(pattern, {
    cwd: buildDir,
    onlyFiles: true,
    absolute: true
  })
    .then(files =>  {
      if (files.length > 0) {
        return Promise.all(files.map(file => getFileSize(file, compression)))
      } else {
        throw new SilentError(`Asset Size check failed. No files found for the pattern '${pattern}'`)
      }
    })
    .then(fileSizes => combineSizes(fileSizes))
};
