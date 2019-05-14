'use strict';

module.exports = {
  name: require('./package').name,

  includedCommands() {
    return {
      'bundlesize:test': require('./lib/commands/test'),
      'bundlesize:show-config': require('./lib/commands/show-config'),
      'bundlesize:update-config': require('./lib/commands/update-config'),
    };
  },
};
