'use strict';

const path = require('path');

module.exports = {
  name: 'bundlesize:show-config',
  description: 'Print your app\'s bundle definition',
  works: 'insideProject',

  availableOptions: [
    { name: 'config-path', type: String, default: 'config/bundlesize.js' },
    { name: 'outer-bundle', type: String },
  ],

  run(options) {
    let ShowConfig = require('../tasks/show-config');

    let showConfigTask = new ShowConfig({
      ui: this.ui,
      rootDir: this.project.root,
      configPath: options.configPath,
      outerBundle: options.outerBundle
    });

    return showConfigTask.run();
  }
};
