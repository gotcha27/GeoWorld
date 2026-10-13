// Vérifie que la carte GeoWorld est réellement rendue.
describe("Carte GeoWorld", () => {
    it("affiche la carte et ses éléments", () => {
        cy.intercept("POST", "http://localhost:3000/refresh", {
            statusCode: 200,
            body: { accessToken: "test-token" },
        });

        cy.visit("http://localhost:5173/");

        // Vérifie que le conteneur est visible.
        cy.get("#map", { timeout: 20000 })
            .should("be.visible");

        // Vérifie que MapLibre a créé son canevas de dessin.
        cy.get("#map canvas")
            .should("exist")
            .and("be.visible")
            .and(($canvas) => {
                expect($canvas[0].width).to.be.greaterThan(0);
                expect($canvas[0].height).to.be.greaterThan(0);
            });

        // Vérifie que MapLibre a terminé le chargement de la carte.
        cy.get("#map.maplibregl-map")
            .should("exist");

        cy.window().its("map").should("exist");
    });
});