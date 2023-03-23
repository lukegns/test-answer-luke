describe('Luke Sambur Testing', () => {
  let headers;
  
  before(() => {
    const username = Cypress.env('USERNAME');
    const password = Cypress.env('PASSWORD');
    
    const auth = `Basic ${btoa(`${username}:${password}`)}`;
    headers = {
      'Content-Type': 'application/json',
      Authorization: auth
    };
  });

  it('As a user, I want to be able to fetch a list of countries, so that I can display them in my own application.', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8080/countries?order=asc',
      headers
    }).then(response => {
      expect(response.status).to.equal(200);
      expect(response.body[1]).to.have.all.keys('name', 'code', 'population');
    });
  });

  it('As an admin, I want to be able to update a countries population, so that I can ensure the populations are accurate when new consensus data is made available.', () => {
    const data = { name: 'INDONESIA', population: 3 };
    const countryID = 'ina';

    cy.request({
      method: 'PATCH',
      url: 'http://localhost:8080/countries/${countryID}',
      body: data,
      headers
    }).then(response => {
      expect(response.status).to.equal(202);
      expect(response.body.name).to.equal('INDONESIA');
      expect(response.body.code).to.equal('ina');
      expect(response.body.population).to.equal(3);
    });
  });

  it('As an admin, I want to be able to remove a country from the list, so that I can maintain only countries that make it on to my chart.', () => {
    const countryId = 'hkg';

    cy.request({
      method: 'DELETE',
      url: `http://localhost:8080/countries/${countryId}`,
      headers
    }).then(response => {
      expect(response.status).to.equal(204);
    });
  });

  it('As an admin, I want to be able to reset the database back to its original state, so that I can quickly recover from any problems that might be introduced when editing.', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8080/countries/reset',
      headers
    }).then(response => {
      expect(response.status).to.equal(204);
    });
  });
});
