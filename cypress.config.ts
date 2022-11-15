import { defineConfig } from 'cypress';

module.exports = defineConfig({
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
  },
});
