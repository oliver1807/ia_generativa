describe('API Tests for GET /customers', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('should return a paginated list of customers with default parameters', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo.currentPage).to.eq(1);
    });
  });

  it('should return a paginated list of customers with specific size and industry filters', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        page: 2,
        limit: 10,
        size: 'Medium',
        industry: 'Technology',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body.customers).to.be.an('array');
      response.body.customers.forEach((customer) => {
        expect(customer.size).to.eq('Medium');
        expect(customer.industry).to.eq('Technology');
      });
      expect(response.body.pageInfo.currentPage).to.eq(2);
    });
  });

  it('should return customers with null values for optional fields when data is missing', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
    }).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        expect(customer).to.have.property('contactInfo');
        expect(customer).to.have.property('address');
      });
    });
  });

  it('should return a 400 status code for invalid page parameter', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        page: -1,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should return a 400 status code for invalid limit parameter', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        limit: 'abc',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should return a 400 status code for unsupported size value', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        size: 'UnknownSize',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should return a 400 status code for unsupported industry value', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        industry: 'UnknownIndustry',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should validate the size attribute based on the number of employees', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
    }).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        const employees = customer.employees;
        if (employees < 100) {
          expect(customer.size).to.eq('Small');
        } else if (employees >= 100 && employees < 1000) {
          expect(customer.size).to.eq('Medium');
        } else if (employees >= 1000 && employees < 10000) {
          expect(customer.size).to.eq('Enterprise');
        } else if (employees >= 10000 && employees < 50000) {
          expect(customer.size).to.eq('Large Enterprise');
        } else {
          expect(customer.size).to.eq('Very Large Enterprise');
        }
      });
    });
  });
});

