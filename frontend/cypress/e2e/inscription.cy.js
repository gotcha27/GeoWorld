
// Vérifie l'accès au formulaire d'inscription
describe('Inscription GeoWorld', () => {
  it('ouvre la page d’inscription depuis la connexion', () => {
    cy.visit('http://localhost:5173/connexion');
    cy.contains('a', 'Créer un compte').click();
    cy.url().should('include', '/inscription');
  });
});