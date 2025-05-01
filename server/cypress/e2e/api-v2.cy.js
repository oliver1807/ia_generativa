describe('API Tests for /customers endpoint', () => {
    const apiUrl = Cypress.env('apiUrl')  
    
  
    it('filters customers correctly based on size and industry', () => {
      cy.request('GET', `${apiUrl}/customers?size=Small&industry=Retail`).then(({ status, body }) => {
        expect(status).to.eq(200)
        const { customers } = body
        customers.forEach(({ size, industry }) => {
          expect(size).to.eq('Small')
          expect(industry).to.eq('Retail')
        })
      })
    })
  
    it('returns a 400 status for invalid query parameter values', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/customers?page=-1&limit=abc&size=InvalidSize&industry=UnknownIndustry`,
        failOnStatusCode: false
      }).then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('error')
      })
    })
  
    it('returns the correct pagination info when querying with valid parameters', () => {
      cy.request('GET', `${apiUrl}/customers?page=2&limit=5`).then(({ status, body }) => {
        expect(status).to.eq(200)
        const { pageInfo } = body
        expect(pageInfo).to.have.property('currentPage', 2)
        expect(pageInfo).to.have.property('totalPages').and.be.a('number')
        expect(pageInfo).to.have.property('totalCustomers').and.be.a('number')
      })
    })
  
    it('handles requests with no query parameters and uses default values', () => {
      cy.request('GET', `${apiUrl}/customers`).then(({ status, body }) => {
        expect(status).to.eq(200)
        const { customers, pageInfo } = body
        expect(customers.length).to.be.lte(10)
        expect(pageInfo).to.have.property('currentPage', 1)
      })
    })
  })