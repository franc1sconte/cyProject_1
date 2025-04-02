

describe('Pagina principal', { tags: '@homepage' }, () => {
    


    // beforeEach(() => {
        
    // })

    // afterEach(() => {
        
    // })

    it('First test', { tags: '@001' }, () => {
        cy.visit('https://demoqa.com/')
        cy.url('https://demoqa.com/').should('be.eq', 'https://demoqa.com/')
        
    })

    it('Second test', { tags: '@002' }, () => {
        cy.visit('https://www.comocriarmariposas.com.ar/')
        cy.url('https://www.comocriarmariposas.com.ar/').should('not.be.eq', 'https://demoqa.com/')
        
    })


    
})