'use strict';

const path = require('path');
const fs = require('fs');
const SilentError = require('silent-error');

module.exports = class BundlesizeTestTask {

  constructor(options) {
    Object.assign(this, options);
  }

  run() {
    this.ui.writeLine(JSON.stringify(this.showConfig(this.options), null, 2));
    return Promise.resolve();
  }

  showConfig() {
    let configPath = path.join(this.rootDir, this.configPath);
    if (!fs.existsSync(configPath)) {
      throw new SilentError(`Config file '${this.configPath}' not found. Please run 'ember generate ember-cli-bundlesize' to generate a default config`);
    }

    let config = require(configPath);
    const bundle = config.bundle !== undefined ? config.bundle : config;
    let bundleNamePattern = new RegExp(this.outerBundle);
    if(this.outerBundle) {
      let appNames = Object.keys(bundle);
      let result = {};
      appNames.filter(key => bundleNamePattern.test(key)).forEach(key => result[key] = bundle[key]);
      return result;
    }
    return bundle;
  }
};
