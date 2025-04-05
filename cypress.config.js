const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    env: {
      assertsJson: "asserts.json",
      datosJson: "datos.json" 
    },
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports", //--> Carpeta donde se generan los reportes
      overwrite: false,
      html: true,
      json: true
    },
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      
    },
  },
});
