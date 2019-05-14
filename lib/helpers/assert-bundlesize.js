'use strict';

const bytes = require('bytes');
const getBundlesize = require('./get-bundlesize');

function compressionLabel(compression) {
  switch (compression) {
    case null:
    case undefined:
    case 'none':
      return 'uncompressed';
    default:
      return compression;
  }
}

module.exports = function assertBundlesize(config, buildDir) {
  let {
    pattern,
    limit,
    compression
  } = config;

  let maxSize = bytes.parse(limit);

  // @todo validate config

  return getBundlesize(pattern, buildDir, compression)
    .then(size => {
      if (size > maxSize) {
        let suggestedLimit = 1.05 * size;
        throw new Error(`${bytes(size)} (Current Size) > ${bytes(maxSize)} (Limit) Using Compression:${compressionLabel(compression)}, Suggested Limit: ${bytes(suggestedLimit)}`);
      } else {
        return `${bytes(size)} (Current Size) <= ${bytes(maxSize)} (Limit) Using Compression:${compressionLabel(compression)}`;
      }
    });
};
