'use strict';

const path = require('path');

module.exports = {
  name: 'bundlesize:update-config',
  description: 'Update your app\'s bundle size definition',
  works: 'insideProject',

  availableOptions: [
    { name: 'config-path', type: String, default: 'config/bundlesize.js' },
    { name: 'outer-bundle', type: String},
    { name: 'inner-bundle', type: String},
    { name: 'limit', type: String, default: true },
    { name: 'compression', type: String } // default none
  ],

  run(options) {
    let UpdateConfig = require('../tasks/update-config');

    let updateConfigTask = new UpdateConfig({
      ui: this.ui,
      rootDir: this.project.root,
      buildDir: path.join(this.project.root, 'dist'),
      configPath: options.configPath,
      innerBundle: options.innerBundle,
      outerBundle: options.outerBundle,
      limit: options.limit,
      compression: options.compression,
    });

    return updateConfigTask.run();
  }
};
