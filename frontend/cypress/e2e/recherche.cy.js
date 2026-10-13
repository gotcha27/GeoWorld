
// Vérifie la recherche d'un pays, son centrage et les données de surbrillance sur la carte.

describe("Surbrillance des résultats GeoWorld", () => {
  const france = {
    countryId: 1,
    name_country: "France",
    iso_code_2: "FR",
    iso_code: "FRA",
  };

  it("recherche France et diagnostique sa surbrillance", () => {
    cy.viewport(1280, 800);

    cy.intercept("POST", "http://localhost:3000/refresh", {
      statusCode: 200,
      body: { accessToken: "test-token" },
    });

    cy.intercept("GET", "**/search?*", {
      statusCode: 200,
      body: { countries: [france], territories: [] },
    }).as("search");

    cy.intercept("GET", "**/geocoding/**", {
      statusCode: 200,
      body: {
        features: [{
          bbox: [-5.14, 41.33, 9.56, 51.09],
          center: [2.35, 48.86],
          geometry: {
            type: "Point",
            coordinates: [2.35, 48.86],
          },
          properties: { name: "France" },
        }],
      },
    }).as("geocoding");

    cy.visit("http://localhost:5173/");

    // Attend le rendu de la carte.
    cy.get("#map canvas", { timeout: 20000 }).should("exist");
    cy.get('[aria-label="Ouvrir la recherche"]').click();

    // Recherche France.
    cy.get('[aria-label="Rechercher un pays ou territoire"]')
      .should("be.visible")
      .type("France");

    cy.get('[aria-label="Rechercher un pays"]').click();

    cy.wait("@search").then(({ request, response }) => {
      expect(request.url).to.include("type=country");
      expect(response.body.countries[0].iso_code_2).to.equal("FR");
    });

    // Sélectionne le résultat.
    cy.contains(".v-list-item", "France")
      .should("be.visible")
      .click();

    cy.wait("@geocoding");

    // Vérifie le filtre et diagnostique les données géographiques.
    cy.window().should((win) => {
      const map = win.__geoWorldMap;

      expect(map, "carte accessible").to.exist;
      expect(map.getLayer("country-highlight"), "couche de surbrillance").to.exist;

      const filter = map.getFilter("country-highlight");

      expect(filter, "filtre de la France").to.deep.equal([
        "all",
        ["==", ["get", "level"], 0],
        ["==", ["get", "iso_a2"], "FR"],
      ]);

      const canvas = map.getCanvas();
      const bounds = map.getBounds();
      const features = map.queryRenderedFeatures({
        layers: ["country-highlight"],
      });

      console.log("Filtre appliqué :", filter);
      console.log("Source :", map.getSource("countries-data"));
      console.log("Style chargé :", map.isStyleLoaded());
      console.log("Zoom :", map.getZoom());
      console.log("Limites visibles :", bounds.toArray());
      console.log("Dimensions du canvas :", canvas.width, canvas.height);
      console.log("Nombre d'entités trouvées :", features.length);
      console.log(
        "Propriétés des entités :",
        features.map((feature) => feature.properties)
      );
    });
  });
});