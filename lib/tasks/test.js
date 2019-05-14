'use strict';

const path = require('path');
const fs = require('fs');
const SilentError = require('silent-error');
const chalk = require('chalk');
const emberBuild = require('../helpers/ember-build');
const assertBundlesize = require('../helpers/assert-bundlesize');

module.exports = class BundlesizeTestTask {

  constructor(options) {
    Object.assign(this, options);
  }

  run() {
    let errors = 0;
    let result = [];
    return Promise.resolve()
      .then(() => {
        if (this.buildApp) {
          this.ui.startProgress('Building for production...');
          return emberBuild()
            .then(() => this.ui.stopProgress());
        }
      })
      .then(() => {
        let config = this.getConfig();
        return Promise.all(
          Object.keys(config)
            .map((key, index) => {
               return assertBundlesize(config[key], this.buildDir)
                .then((msg) => {
                  return { status: 'ok', idx: index+1, msg : `ok ${index+1} - ${key}: ${msg}` };
                })
                .catch((err) => {
                  errors++;
                  return { status: 'not ok', idx: index+1, msg : `not ok ${index+1} - ${key}: ${err.message}` };
                });
            })
        )
      })
      .then((results) => {
        // Sort and print the failures followed by success messages
        this.sort(results, 'not ok').forEach(res => this.ui.writeLine(chalk.red(res['msg'])));
        this.sort(results, 'ok').forEach(res => this.ui.writeLine(chalk.green(res['msg'])));

        if (errors > 0) {
          throw new SilentError(`\n Bundlesize check failed with ${errors} error${errors > 1 ? 's' : ''}!`);
        } else {
          this.ui.writeLine(chalk.green('Bundlesize check was successful. Good job!'));
        }
      })
  }

  sort(results, key) {
    return results.filter((res) => res['status'] === key).sort((a, b) => a['idx'] - b['idx'])
  }

  /**
   * Get the config object after applying the include and exclude filters
   */
  getConfig() {
    let configPath = path.join(this.rootDir, this.configPath);
    if (!fs.existsSync(configPath)) {
      throw new SilentError(`Config file '${this.configPath}' not found. Please run 'ember generate ember-cli-bundlesize' to generate a default config`);
    }
    let config = require(configPath);

    if(config.bundle) {
      // Include only the keys which match 'config.include'
      if(config.include && config.include.length > 0) {
        let includePattern = new RegExp(config.include.join("|"));
        let includeBundle = {};
        Object.keys(config.bundle).filter(key => includePattern.test(key))
          .forEach(key => {
            includeBundle[key] = config.bundle[key];
        });
        config.bundle = includeBundle;
      } else if(config.exclude && config.exclude.length > 0) {
        // Delete the keys which are present in 'config.exclude' from config object
        let excludePattern = new RegExp(config.exclude.join("|"));
        Object.keys(config.bundle).filter(key => excludePattern.test(key))
          .forEach(key => {
            delete config.bundle[key];
        });
      }
      return this._getFlattenedConfig(config.bundle);
    }
    return this._getFlattenedConfig(config);
  }

  /**
   * Flatten config by joining app name with pattern name. An `app` with pattern for `javascript` in config is returned
   * as `{ ['app:javascript']: { limit, pattern, compression } }`.
   * @param {Object} config
   */
  _getFlattenedConfig(config) {
    const appNames = Object.keys(config);
    const flattenedConfig = appNames.reduce((result, appName) => {
      const app = config[appName];
      const patterns = Object.keys(app);
      const appPatternWithConfig = patterns.reduce((appResult, pattern) => {
        const appNameWithPatternKey = `${appName}:${pattern}`;
        appResult[appNameWithPatternKey] = app[pattern];
        return appResult;
      }, {});
      return Object.assign(appPatternWithConfig, result);
    }, {});
    return flattenedConfig;
  }
};
