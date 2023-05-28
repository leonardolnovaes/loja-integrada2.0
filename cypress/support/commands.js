/// <reference types="cypress" />
const base = require('./elements').ELEMENTS
import data from "../fixtures/cart.json";

 Cypress.Commands.add('addProductInCart', (product) => {
    cy.intercept(`/carrinho/produto/${product}/adicionar`).as('addProductCart')
    cy.get(base.openProduct).eq(0).click({force: true})
    cy.get(base.addProduct).click({force:true})
    cy.wait('@addProductCart')
  })

Cypress.Commands.add('fillCouponName', (name) => {
    cy.get(base.inputCoupon).type(name)
    cy.get(base.buttonUseCoupon).click()
    cy.pause()
})

Cypress.Commands.add('inputAndButtonCouponNotExist', () => {
    cy.get(base.inputCoupon).should('not.exist')
    cy.get(base.buttonUseCoupon).should('not.exist')
})

Cypress.Commands.add('inputAndButtonCouponExist', () => {
    cy.get(base.inputCoupon).should('exist')
    cy.get(base.buttonUseCoupon).should('exist')
})

Cypress.Commands.add('inputCouponBeClean', () => {
    cy.get(base.inputCoupon).should('be.empty')
})

Cypress.Commands.add('errorMessageCoupon', (message) => {
    cy.get(base.messageError).should('contain.text', message)
})

Cypress.Commands.add('removeCoupon', () => {
    cy.get(base.removeCoupon).should('be.visible').click().should('not.exist')
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

Cypress.Commands.add('percentageCouponDiscounts', (percentage) => {
    cy.get(base.couponDiscountValue).should('contain.text', percentage)
    
    let total = 0.1 * 80
    let amount = 80 - total 
    cy.get(base.amountTotal).should('contain.text', amount)
})

Cypress.Commands.add('fixedValuesCouponDiscounts', (discount) => {
    cy.get(base.couponDiscountValue).should('contain.text', discount)
    const total = 80 - discount
    cy.get(base.amountTotal).should('contain.text', total)
})

Cypress.Commands.add('verifyProductAddedInCart', () => {
    cy.get(base.photoProductCart).should('have.attr', 'src', data.product[0].photo)
    cy.get(base.descriptionProductCart).should('contain.text', data.product[0].name)
    cy.get(base.skuAndStockProductCart).eq(0).should('contain.text', data.product[0].sku)
    cy.get(base.skuAndStockProductCart).eq(1).should('contain.text', data.product[0].stock)
    cy.get(base.unitPriceProductCart).should('contain.text', data.product[0].price)
    cy.get(base.subTotalProductCart).should('contain.text', data.product[0].price)
    cy.get(base.subTotalCart).should('contain.text', data.product[0].price)
    cy.get(base.amountTotal).should('contain.text', data.product[0].price)
})

Cypress.Commands.add('incrementQuantity', () => {
    cy.get(base.plusIconCart).should('be.visible').click()
    cy.get(base.inputQuantityCart).should('have.value', 2)
    const subTotal = data.product[0].price * 2
    cy.get(base.subTotalProductCart).should('contain.text', subTotal)
    cy.get(base.subTotalCart).should('contain.text', subTotal)
    cy.get(base.amountTotal).should('contain.text', subTotal)
})
Cypress.Commands.add('decrementQuantity', () => {
    cy.get(base.plusIconCart).should('be.visible').click()
    cy.get(base.inputQuantityCart).should('have.value', 2)
    const subTotal = data.product[0].price * 2
    cy.get(base.subTotalProductCart).should('contain.text', subTotal)
    cy.get(base.subTotalCart).should('contain.text', subTotal)
    cy.get(base.amountTotal).should('contain.text', subTotal)
    cy.get(base.minusIconCart).should('be.visible').click()
    cy.get(base.inputQuantityCart).should('have.value', 1)
    cy.get(base.subTotalProductCart).should('contain.text', data.product[0].price)
    cy.get(base.subTotalCart).should('contain.text', data.product[0].price)
    cy.get(base.amountTotal).should('contain.text', data.product[0].price)
})

Cypress.Commands.add('inputQuantity', (quantity) => {
    cy.get(base.inputQuantityCart).clear().type(quantity).should('have.value', quantity)
    cy.get(base.refreshQuantityCart).should('be.visible')
    cy.get(base.refreshQuantityCart).click().should('not.exist')
    const subTotal = data.product[0].price * quantity
    cy.get(base.subTotalProductCart).should('contain.text', subTotal)
    cy.get(base.subTotalCart).should('contain.text', subTotal)
    cy.get(base.amountTotal).should('contain.text', subTotal)
})

Cypress.Commands.add('deleteProduct', () => {
    cy.get(base.removeProductCart).should('be.visible').click()
})

Cypress.Commands.add('emptyStateCart', () => {
    cy.get(base.textEmptyStateCart).should('be.visible').and('contain.text', 'Não existem produtos no carrinho')
    cy.get(base.buttonEmptyStateCart).should('be.visible').and('contain.text', 'Ir às compras')
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

Cypress.Commands.add('selectDeliveryTypePickUp', () => {
    cy.get(base.radioInputDeliveryType).eq(0).should('be.visible').click()
    cy.get(base.amountTotal).should('contain.text', data.product[0].price)
})

Cypress.Commands.add('selectDeliveryTypeSedex', () => {
    cy.get(base.radioInputDeliveryType).eq(1).should('be.visible').click()
    cy.readFile('cypress/fixtures/temp.json').then(temp => {
        const total = temp[0].shippingPrice + data.product[0].price
        cy.get(base.amountTotal).should('contain.text', total)
    })
})

Cypress.Commands.add('selectDeliveryTypeSedexWithCoupon', () => {
    cy.get(base.radioInputDeliveryType).eq(1).should('be.visible').click()
    cy.readFile('cypress/fixtures/temp.json').then(temp => {
        const total = temp[0].shippingPrice + data.product[0].price
        cy.get(base.amountTotal).should('contain.text', data.product[0].price)
    })
    cy.get(base.amountTotal).should('contain.text', '80,00')
})