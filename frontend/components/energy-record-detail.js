import records from "../api/records.js";

/**
 * A custom element for a detailed energy record view.
 * The current energy record ID is stored as an attribute on the element itself.
 * when this ID changes, the view is recreated to reflect the information of the new record.
 */
export default class EnergyDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #year;
    /** @type {HTMLElement} */ #energyPerCapita;
    /** @type {HTMLElement} */ #gdpPerCapita;

    /**
     * Get and set the energy record year.
     */
    get energyRecordYear() {
        return this.getAttribute("energy-record-year");
    }

    set energyRecordYear(value) {
        if(value == null)
            this.removeAttribute("energy-record-year");
        else
            this.setAttribute("energy-record-year", value);
    }

    static get observedAttributes() {
        return ["energy-record-year"];
    }

    constructor() {
        super();

        this.#template = document.getElementById("energy-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    initializeTemplate() {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

            this.#year = this.shadowRoot.getElementById("year");
            this.#energyPerCapita = this.shadowRoot.getElementById("energy-per-capita");
            this.#gdpPerCapita = this.shadowRoot.getElementById("gdp-per-capita");
    }

    async attributeChangedCallback() {
        if(!this.energyRecordYear) {
                this.shadowRoot.innerHTML = "";

            return;
        }

        /** @type {} */
        let record;
        try {
                record = await records.getTempChangeRecord(this.energyRecordYear);

        } catch(e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#year.innerText = record.year;
        this.#energyPerCapita = record.energy_per_capita;
        this.#gdpPerCapita = record.gdp_per_capita;
    }
};

window.customElements.define("energy-record-detail", EnergyDetail);