import homePage from "../../support/pages/Homepage/homePage"

describe('Pagina principal', { tags: '@homepage' }, () => {
    let asserts
    let datos

    beforeEach(() => {
        cy.fixture(Cypress.env("assertsJson")).then(function (assertsv) {
            asserts = assertsv
        })
        cy.fixture(Cypress.env("datosJson")).then(function (datosv) {
            datos = datosv
        })
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
          });
    })

    it('First', { tags: '@001' }, () => {
        cy.visit(asserts.urls.homepage)
        cy.get(homePage.logoAassert(), {timeout:5000})
        

    })

})