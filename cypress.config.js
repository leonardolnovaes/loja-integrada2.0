const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://qastoredesafio.lojaintegrada.com.br',
    setupNodeEvents(on, config) {
    },
  },
});
