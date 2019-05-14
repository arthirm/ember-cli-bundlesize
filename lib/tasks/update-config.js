'use strict';

const path = require('path');
const fs = require('fs');
const SilentError = require('silent-error');

module.exports = class BundlesizeTestTask {

  constructor(options) {
    Object.assign(this, options);
  }

  run() {
    this.updateConfig();
    return Promise.resolve();
  }

  updateConfig() {
    let configPath = path.join(this.rootDir, this.configPath);
    if (!fs.existsSync(configPath)) {
      throw new SilentError(`Config file '${this.configPath}' not found. Please run 'ember generate ember-cli-bundlesize' to generate a default config`);
    }
    let config = require(configPath);
    const bundle = config.bundle !== undefined ? config.bundle : config;

    if (this.limit) {
      bundle[this.outerBundle][this.innerBundle]["limit"] = this.limit;
    }

    if(this.compression) {
      bundle[this.outerBundle][this.innerBundle]["compression"] = this.compression;
    }
  
    fs.writeFileSync(configPath, config);
  }
};
