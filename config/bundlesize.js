module.exports = {
  include : [],
  exlcude : [],
  bundle : {
    app : {
      javascript: {
        pattern: 'assets/*.js',
        limit: '150KB',
        compression: 'brotli'
      },
      css: {
        pattern: 'assets/*.css',
        limit: '1MB',
        compression: 'gzip'
      }
    }
  }
};
