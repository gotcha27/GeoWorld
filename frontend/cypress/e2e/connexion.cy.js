
// Vérifie l'affichage du formulaire de connexion
describe('Connexion GeoWorld', () => {
  it('affiche le formulaire et le lien d’inscription', () => {
    cy.visit('http://localhost:5173/connexion');
    cy.contains('Connexion').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('button', 'Se connecter').should('be.visible');
    cy.contains('a', 'Créer un compte').should('be.visible');
  });
});