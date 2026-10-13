
<!-- Affiche la carte et les informations du pays ou territoire survolé ou recherché. -->

<template>
    <div>
        <div id="map" class="hidden"></div>
        <div
            v-if="hoveredCountry"
            class="country-tooltip"
            :style="{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
            }"
        >
            <div class="tooltip-accent"></div>
            <div class="country-type">
                {{ hoveredCountry.name_territory ? "TERRITOIRE" : "PAYS" }}
            </div>
            <div
                v-if="
                    hoveredCountry.flag?.picture_flag ||
                    hoveredCountry.country?.flag?.picture_flag
                "
                class="flag-container"
            >
                <img
                    :src="
                        hoveredCountry.flag?.picture_flag ||
                        hoveredCountry.country?.flag?.picture_flag
                    "
                    alt="Drapeau"
                    class="country-flag"
                />
            </div>
            <div class="country-name">
                {{
                    hoveredCountry.name_territory ||
                    hoveredCountry.name_country ||
                    hoveredCountry.country?.name_country
                }}
            </div>
            <div class="tooltip-separator"></div>
            <div class="capital-row">
                <span class="capital-icon">⌂</span>
                <div>
                    <div class="capital-label">CAPITALE</div>
                    <div class="capital-name">
                        {{
                            hoveredCountry.capital?.name_capital ||
                            hoveredCountry.country?.capital?.name_capital ||
                            "Non renseignée"
                        }}
                    </div>
                </div>
            </div>
            <div class="money-row">
                <span class="money-icon">¤</span>
                <div>
                    <div class="money-label">MONNAIE</div>
                    <div class="money-name">
                        {{
                            hoveredCountry.money?.name_money ||
                            hoveredCountry.country?.money?.name_money ||
                            "Non renseignée"
                        }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createCountryMap, selectCountryOnMap } from "../map/countryMap";
import {
    getCountryByIsoCode,
    getTerritoryByIsoCode,
} from "../services/countryService";

export default {
    data() {
        return {
            hoveredCountry: null,
            tooltipPosition: { x: 0, y: 0 },
            searchHandler: null,
            positionHandler: null,
            mapClickHandler: null,
        };
    },
    mounted() {
        createCountryMap({
            onCountryChange: (country) => {
                this.hoveredCountry = country;
            },
            onPositionChange: (position) => {
                this.tooltipPosition = position;
            },
        });

        this.searchHandler = async (event) => {
            const result = event.detail;
            if (!result?.item) return;

            const item = result.item;
            const isoCode = item.iso_code_2;

            if (!isoCode) {
                this.hoveredCountry = item;
                this.tooltipPosition = { x: 24, y: 85 };
                selectCountryOnMap(result);
                return;
            }

            try {
                let fullItem =
                    result.type === "territory"
                        ? await getTerritoryByIsoCode(isoCode)
                        : await getCountryByIsoCode(isoCode);

                if (!fullItem) fullItem = item;

                this.hoveredCountry = fullItem;
                this.tooltipPosition = { x: 24, y: 85 };

                // Conserve la sélection et le zoom sur le résultat recherché.
                selectCountryOnMap(result);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des informations :",
                    error,
                );
                this.hoveredCountry = item;
                this.tooltipPosition = { x: 24, y: 85 };
                selectCountryOnMap(result);
            }
        };

        this.positionHandler = (event) => {
            this.tooltipPosition = event.detail;
        };

        window.addEventListener(
            "geoworld-search-select",
            this.searchHandler,
        );

        window.addEventListener(
            "geoworld-country-position",
            this.positionHandler,
        );

        this.mapClickHandler = () => {
            this.hoveredCountry = null;
        };

        document
            .getElementById("map")
            ?.addEventListener("click", this.mapClickHandler);
    },
    beforeUnmount() {
        window.removeEventListener(
            "geoworld-search-select",
            this.searchHandler,
        );

        window.removeEventListener(
            "geoworld-country-position",
            this.positionHandler,
        );

        document
            .getElementById("map")
            ?.removeEventListener("click", this.mapClickHandler);
    },
};
</script>

<style scoped>
#map {
    display: flex;
    align-items: center;
    position: absolute;
    top: 61px;
    bottom: 50px;
    width: 100%;
    cursor: pointer;
}

/* .hidden {
    display: none;
} */

.country-tooltip {
    position: fixed;
    z-index: 999999;
    pointer-events: none;
    min-width: 190px;
    padding: 14px 17px;
    border-radius: 14px;
    background: rgba(10, 17, 28, 0.86);
    border: 1px solid rgba(125, 211, 252, 0.28);
    box-shadow:
        0 12px 35px rgba(0, 0, 0, 0.45),
        0 0 25px rgba(77, 184, 255, 0.08);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    white-space: nowrap;
    overflow: hidden;
}

.tooltip-accent {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #7dd3fc, #38bdf8);
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.8);
}

.country-type {
    margin-left: 2px;
    color: rgba(125, 211, 252, 0.8);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
}

.flag-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 44px;
    margin: 8px auto 7px;
    padding: 3px;
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow:
        0 4px 14px rgba(0, 0, 0, 0.25),
        0 0 12px rgba(125, 211, 252, 0.05);
    overflow: hidden;
}

.country-flag {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 4px;
}

.country-name {
    margin-top: 3px;
    color: white;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.1px;
    text-align: center;
    white-space: normal;
    line-height: 1.2;
}

.tooltip-separator {
    height: 1px;
    margin: 11px 0;
    background: rgba(255, 255, 255, 0.09);
}

.capital-row,
.money-row {
    display: flex;
    align-items: center;
    gap: 9px;
}

.money-row {
    margin-top: 11px;
}

.capital-icon,
.money-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 7px;
    color: #7dd3fc;
    background: rgba(125, 211, 252, 0.1);
    border: 1px solid rgba(125, 211, 252, 0.14);
    font-size: 16px;
}

.money-icon {
    font-size: 15px;
}

.capital-label,
.money-label {
    color: rgba(255, 255, 255, 0.4);
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1.2px;
}

.capital-name,
.money-name {
    margin-top: 1px;
    color: rgba(255, 255, 255, 0.88);
    font-size: 13px;
    font-weight: 500;
    white-space: normal;
    line-height: 1.25;
}
</style>