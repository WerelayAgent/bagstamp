const { resolve } = require('path');

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        communities: resolve(__dirname, 'communities.html'),
        proposals: resolve(__dirname, 'proposals.html'),
      },
    },
  },
};
