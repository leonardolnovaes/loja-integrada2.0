/// <reference types="cypress" />
import data from "../fixtures/cart.json";
describe('Testes de Carrinho', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.addProductInCart(data.product[0].code)
  })
  describe('Fluxo principal de carrinho', () => {
    it('Adicionar produto no carrinho', () => {
      cy.verifyProductAddedInCart()
    });
    it('Acrescentar quantidade do produto', () => {
      cy.incrementQuantity()
    });
    it('Decrementar quantidade do produto', () => {
      cy.decrementQuantity()
    })
    it('Inserir uma quantidade do produto pelo input', () => {
      cy.inputQuantity(10)
    })
    it('Realizar a exclusão de um produto no carrinho', () => {
      cy.deleteProduct()
      cy.emptyStateCart()
    })
    it('Inserir CEP para o calculo do frete', () => {
      cy.fillZipCode(data.zipCode)
    })
    it('Escolher a forma de entrega retirar pessoalmente', () => {
      cy.fillZipCode(data.zipCode)
      cy.selectDeliveryTypePickUp()
    })
    it('Escolher a forma de entrega Sedex', () => {
      cy.fillZipCode(data.zipCode)
      cy.selectDeliveryTypeSedex()
    })
  })
})
describe('Testes de Cupom', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.addProductInCart(data.product[0].code)
  })
  describe('Fluxo Principal de Cupom', () => {
    it('Adicionar cupom com frete grátis', () => {
      cy.fillZipCode(data.zipCode)
      cy.fillCouponName(data.freeShippingCoupon)
      cy.freeShippingInformations()
      cy.inputAndButtonCouponNotExist()
      cy.tagCouponName(data.freeShippingCoupon)
      cy.selectDeliveryTypeSedexWithCoupon()
    })
    it.only('Adicionar cupom com desconto em porcentagem', () => {
      cy.fillCouponName(data.percentageCoupon)
      cy.inputAndButtonCouponNotExist()
      cy.tagCouponName(data.percentageCoupon)
      cy.percentageCouponDiscounts('10 %')
    })
    it('Adicionar cupom com desconto em valores', () => {
      cy.fillCouponName(data.fixedPriceCoupon)
      cy.inputAndButtonCouponNotExist()
      cy.tagCouponName(data.fixedPriceCoupon)
      cy.fixedValuesCouponDiscounts(30)
    })
  })
  describe('Fluxo Alternativo de Cupom', () => {
    it('Realizar a tentativa com cupom expirado', () => {
      cy.fillCouponName(data.expiredCoupon)
      cy.inputAndButtonCouponExist()
      cy.inputCouponBeClean()
      cy.errorMessageCoupon('O cupom não é válido.')
    })
    it('Realizar a tentativa com cupom inválido', () => {
      cy.fillCouponName(data.invalidCoupon)
      cy.inputAndButtonCouponExist()
      cy.inputCouponBeClean()
      cy.errorMessageCoupon('Cupom não encontrado.')
    })
    it('Realizar a exclusão de um cupom', () => {
      cy.fillCouponName(data.freeShippingCoupon)
      cy.removeCoupon()
      cy.inputCouponBeClean()
      cy.inputAndButtonCouponExist()
    })
  })
})
