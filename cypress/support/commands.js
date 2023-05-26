const base = require('./elements').ELEMENTS

 Cypress.Commands.add('addProductInCart', (product) => {
    cy.get(base.openProduct).eq(0).click({force: true})
    cy.get(base.addProduct).click({force:true})
  })

Cypress.Commands.add('fillCouponName', (name) => {
    cy.get(base.inputCoupon).type(name)
    cy.get(base.buttonUseCoupon).click().should('not.exist')
})

Cypress.Commands.add('inputAndButtonCouponNotExist', () => {
    cy.get(base.inputCoupon).should('not.exist')
    cy.get(base.buttonUseCoupon).should('not.exist')
})

Cypress.Commands.add('tagCouponName', (name) => {
    cy.get(base.tagCouponName).should('have.text', name)
})

Cypress.Commands.add('freeShippingInformations', () => {
    cy.get(base.freeShippingInformations).should('contain.text', 'Frete Grátis')
    cy.readFile('cypress/fixtures/temp.json').then(res => {
        cy.get(base.shippingPrice).eq(1).should('not.contain.text', res[0].shippingPrice)
        cy.get(base.shippingPrice).eq(1).should('have.text', 'R$ 0,00')
    })
})

Cypress.Commands.add('fillZipCode', (zipCode) => {
    cy.intercept(`/carrinho/endereco/adicionar?cep=${zipCode}`).as('waitZipCode')
    cy.get(base.inputZipCode).type(zipCode)
    cy.readFile('cypress/fixtures/temp.json').then(temp => {
        cy.wait('@waitZipCode').its('response.body').then(res => {
            const response = JSON.parse(res)
            temp[0].shippingPrice = response.deliveries[1].price
            cy.writeFile('cypress/fixtures/temp.json', temp)
            cy.get(base.shippingPrice).eq(1).should('contain.text', temp[0].shippingPrice)

        })
    })
})

Cypress.Commands.add('percentageCouponDiscounts', (percentage) => {
    cy.get(base.couponDiscountValue).should('contain.text', percentage)
    
    let total = 0.1 * 80
    let amount = 80 - total 
    cy.get(base.amountTotal).should('contain.text', amount)
})

Cypress.Commands.add('selectDeliveryTypeSedex', () => {
    cy.get(base.radioInputDeliveryType).eq(1).click()
    cy.get(base.amountTotal).should('contain.text', '80,00')
})