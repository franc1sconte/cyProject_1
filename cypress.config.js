const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports", //--> Carpeta donde se generan los reportes
      overwrite: false,
      html: true,
      json: true
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
