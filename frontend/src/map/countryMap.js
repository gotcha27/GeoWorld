
/* Affiche la carte, détecte les pays et territoires et gère leur surbrillance. */

import * as maptilersdk from "@maptiler/sdk";
import { getCountryByIsoCode, getTerritoryByIsoCode } from "../services/countryService";
import { microCountries } from "./microCountries";

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const MAPTILER_API_URL = import.meta.env.VITE_MAPTILER_API_URL;

maptilersdk.config.apiKey = MAPTILER_API_KEY;

let map;
let currentCountry = null;
let selectedSearchIsoCode = null;
let mapIsLoaded = false;
let selectedSearchCoordinates = null;

const emptyFilter = [
    "all",
    ["==", ["get", "level"], 0],
    ["==", ["get", "iso_a2"], ""],
];

function clearHighlight() {
    if (!map) return;

    [
        "country-highlight",
        "country-highlight-border",
        "svalbard-highlight",
        "svalbard-highlight-border",
    ].forEach((layer) => {
        if (map.getLayer(layer)) map.setFilter(layer, emptyFilter);
    });
}

function highlightCountry(isoCode) {
    if (!map || !mapIsLoaded || !isoCode) return;

    const countryIso = isoCode === "SJ" ? "NO" : isoCode;
    const countryFilter = [
        "all",
        ["==", ["get", "level"], 0],
        ["==", ["get", "iso_a2"], countryIso],
    ];

    ["country-highlight", "country-highlight-border"].forEach((layer) => {
        if (map.getLayer(layer)) map.setFilter(layer, countryFilter);
    });

    const svalbardFilter = [
        "all",
        ["==", ["get", "level"], 0],
        ["==", ["get", "iso_a2"], "SJ"],
    ];

    ["svalbard-highlight", "svalbard-highlight-border"].forEach((layer) => {
        if (!map.getLayer(layer)) return;
        map.setFilter(
            layer,
            isoCode === "NO" || isoCode === "SJ" ? svalbardFilter : emptyFilter,
        );
    });
}

// Place la fenêtre d'informations au centre du pays recherché.
function updateSelectedTooltipPosition() {
    if (!map || !selectedSearchCoordinates) return;

    const point = map.project(selectedSearchCoordinates);
    window.dispatchEvent(
        new CustomEvent("geoworld-country-position", {
            detail: { x: point.x + 15, y: point.y + 15 },
        }),
    );
}

export function createCountryMap({ onCountryChange, onPositionChange }) {
    map = new maptilersdk.Map({
        container: "map",
        style: maptilersdk.MapStyle.DATAVIZ.DARK,
        center: [13.39, 52.51],
        zoom: 2,
    });

    if (import.meta.env.DEV) window.__geoWorldMap = map;

    map.on("load", () => {
        mapIsLoaded = true;
        document.getElementById("map")?.classList.remove("hidden");

        const styleLayers = map.getStyle().layers || [];
        styleLayers.forEach((layer) => {
            if (layer.type === "symbol" || layer.type === "circle") {
                map.setLayoutProperty(layer.id, "visibility", "none");
            }
        });

        map.addSource("countries-data", {
            type: "vector",
            url: `${MAPTILER_API_URL}/tiles/countries/tiles.json?key=${MAPTILER_API_KEY}`,
        });

        map.addLayer({
            id: "country-hover",
            type: "fill",
            source: "countries-data",
            "source-layer": "administrative",
            filter: ["==", ["get", "level"], 0],
            paint: { "fill-color": "#ffffff", "fill-opacity": 0 },
        });

        map.addLayer({
            id: "country-highlight",
            type: "fill",
            source: "countries-data",
            "source-layer": "administrative",
            filter: emptyFilter,
            paint: { "fill-color": "#4db8ff", "fill-opacity": 0.28 },
        });

        map.addLayer({
            id: "country-highlight-border",
            type: "line",
            source: "countries-data",
            "source-layer": "administrative",
            filter: emptyFilter,
            paint: {
                "line-color": "#7dd3fc",
                "line-width": 2.5,
                "line-opacity": 0.95,
            },
        });

        map.addLayer({
            id: "svalbard-highlight",
            type: "fill",
            source: "countries-data",
            "source-layer": "administrative",
            filter: emptyFilter,
            paint: { "fill-color": "#4db8ff", "fill-opacity": 0.28 },
        });

        map.addLayer({
            id: "svalbard-highlight-border",
            type: "line",
            source: "countries-data",
            "source-layer": "administrative",
            filter: emptyFilter,
            paint: {
                "line-color": "#7dd3fc",
                "line-width": 2.5,
                "line-opacity": 0.95,
            },
        });

        map.addLayer({
            id: "country-borders",
            type: "line",
            source: "maptiler_planet",
            "source-layer": "boundary",
            filter: ["==", ["get", "admin_level"], 2],
            paint: {
                "line-color": "#ffffff",
                "line-width": 1,
                "line-opacity": 0.35,
            },
        });

        map.addLayer({
            id: "country-point-hover",
            type: "circle",
            source: "maptiler_planet",
            "source-layer": "place",
            filter: ["==", ["get", "class"], "country"],
            paint: {
                "circle-radius": 18,
                "circle-color": "#ffffff",
                "circle-opacity": 0,
                "circle-stroke-opacity": 0,
            },
        });

        map.addLayer({
            id: "micro-country-hover",
            type: "circle",
            source: "maptiler_planet",
            "source-layer": "place",
            filter: ["==", ["get", "class"], "country"],
            paint: {
                "circle-radius": 30,
                "circle-color": "#ffffff",
                "circle-opacity": 0,
                "circle-stroke-opacity": 0,
            },
        });

        // Maintient la fenêtre à la bonne position pendant le déplacement de la carte.
        map.on("move", updateSelectedTooltipPosition);

        map.on("mousemove", async (event) => {
            // Conserve la sélection issue de la recherche jusqu'au prochain clic sur la carte.
            if (selectedSearchIsoCode) return;

            const { lng, lat } = event.lngLat;
            let detectedIsoCode = null;

            for (const country of microCountries) {
                const distance = Math.sqrt(
                    Math.pow(lng - country.lng, 2) +
                    Math.pow(lat - country.lat, 2),
                );

                if (distance < country.radius) {
                    detectedIsoCode = country.isoCode;
                    break;
                }
            }

            if (!detectedIsoCode) {
                const features = map.queryRenderedFeatures(event.point, {
                    layers: [
                        "country-hover",
                        "country-point-hover",
                        "micro-country-hover",
                    ],
                });

                if (features.length > 0) {
                    detectedIsoCode = features[0].properties?.iso_a2;
                }
            }

            if (!detectedIsoCode) {
                if (currentCountry !== null) {
                    currentCountry = null;
                    clearHighlight();
                    onCountryChange(null);
                }
                return;
            }

            onPositionChange({
                x: event.point.x + 15,
                y: event.point.y + 15,
            });

            if (currentCountry === detectedIsoCode) return;

            currentCountry = detectedIsoCode;

            let country = await getCountryByIsoCode(detectedIsoCode);
            if (!country) country = await getTerritoryByIsoCode(detectedIsoCode);

            if (
                detectedIsoCode === "SJ" &&
                country?.country?.iso_code_2 === "NO"
            ) {
                country = await getCountryByIsoCode("NO");
            }

            if (!country) {
                clearHighlight();
                onCountryChange(null);
                return;
            }

            highlightCountry(detectedIsoCode);
            onCountryChange(country);
        });

        map.on("mouseleave", "country-hover", () => {
            if (selectedSearchIsoCode) return;
            currentCountry = null;
            clearHighlight();
            onCountryChange(null);
        });

        map.on("click", () => {
            selectedSearchIsoCode = null;
            selectedSearchCoordinates = null;
            currentCountry = null;
            clearHighlight();
            onCountryChange(null);
        });
    });
}

// Centre la carte sur le résultat choisi et conserve sa surbrillance.
export async function selectCountryOnMap({ type, item }) {
    if (!item) return;

    const isoCode = item.iso_code_2;
    const name = type === "territory" ? item.name_territory : item.name_country;

    if (!isoCode || !name) return;

    selectedSearchIsoCode = isoCode;
    currentCountry = isoCode;

    // Attend que la carte soit chargée avant de modifier ses couches.
    if (!mapIsLoaded) {
        console.warn("La carte n'est pas encore chargée.");
        return;
    }

    highlightCountry(isoCode);

    // Centre la Russie sans utiliser sa boîte géographique mondiale.
    if (isoCode === "RU") {
        selectedSearchCoordinates = [100, 60];
        map.flyTo({
            center: selectedSearchCoordinates,
            zoom: 2.8,
            duration: 1200,
            essential: true,
        });
        updateSelectedTooltipPosition();
        return;
    }

    // Centre la carte sur Tuvalu, un petit État insulaire du Pacifique.
    if (isoCode === "TV") {
        selectedSearchCoordinates = [179.2, -8.5];
        map.flyTo({
            center: selectedSearchCoordinates,
            zoom: 7,
            duration: 1200,
            essential: true,
        });
        updateSelectedTooltipPosition();
        return;
    }

    // Centre la carte sur la Nouvelle-Zélande.
    if (isoCode === "NZ") {
        selectedSearchCoordinates = [172.5, -41.5];

        map.flyTo({
            center: selectedSearchCoordinates,
            zoom: 4.5,
            duration: 1200,
            essential: true,
        });

        updateSelectedTooltipPosition();
        return;
    }

    try {
        const response = await fetch(
            `${MAPTILER_API_URL}/geocoding/${encodeURIComponent(name)}.json?key=${MAPTILER_API_KEY}&limit=1`,
        );

        if (!response.ok) {
            console.error("Erreur de géocodage :", response.status);
            return;
        }

        const data = await response.json();
        const feature = data.features?.[0];

        if (feature?.bbox?.length === 4) {
            const [west, south, east, north] = feature.bbox;
            selectedSearchCoordinates = feature.center || [
                (west + east) / 2,
                (south + north) / 2,
            ];

            map.fitBounds(
                [
                    [west, south],
                    [east, north],
                ],
                {
                    padding: 60,
                    maxZoom: type === "territory" ? 8 : 6,
                    duration: 1200,
                },
            );

            updateSelectedTooltipPosition();
        } else if (feature?.center) {
            selectedSearchCoordinates = feature.center;
            map.flyTo({
                center: feature.center,
                zoom: type === "territory" ? 6 : 3.5,
                speed: 0.8,
                essential: true,
            });
            updateSelectedTooltipPosition();
        } else {
            console.error("Aucune position trouvée pour :", name);
        }
    } catch (error) {
        console.error("Impossible de centrer la carte :", error);
    }
}