describe('Testes de Carrinho', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.addProductInCart('118475035')
  })
  it('Adicionar cupom com frete grátis', () => {
    cy.fillZipCode('08770-180')
    cy.fillCouponName('FRETEGRATIS')
    cy.freeShippingInformations()
    cy.inputAndButtonCouponNotExist()
    cy.tagCouponName('FRETEGRATIS')
    cy.selectDeliveryTypeSedex()
  })
  it.only('Adicionar cupom com desconto em porcentagem', () => {
    cy.fillCouponName('10OFF')
    cy.inputAndButtonCouponNotExist()
    cy.tagCouponName('10OFF')
    cy.percentageCouponDiscounts('10 %')
    
  })
})
