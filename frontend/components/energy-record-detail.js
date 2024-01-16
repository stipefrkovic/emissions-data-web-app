import records from "../api/records.js";

/**
 * A custom element for a detailed energy record view.
 * Each current energy record attribute (e.g. year) is stored as an attribute on the element itself.
 * When year attribute changes, the view is recreated to reflect the information of the new record.
 */
export default class EnergyDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #year;
    /** @type {HTMLElement} */ #energyPerCapita;
    /** @type {HTMLElement} */ #gdpPerCapita;

    /**
     * Get and set the energy record year attribute.
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

    /**
     * This indicates to the browser that we want to be notified of any changes
     * to each attribute of an energy record. The browser will then call "attributeChangedCallback"
     * for us. This will also be called when someone sets a new value to the property
     * above, since that set operation is translated into setting a new attribute
     * value.
     */
    static get observedAttributes() {
        return ["energy-record-year"];
    }

    /**
     * A constructor for setting up the proper template environment.
     */
    constructor() {
        super();

        this.#template = document.getElementById("energy-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    /**
     * A function that clones the template and sets the HTML references. 
     * This allows to completely refresh the contents when loading a new energy record, instead 
     * of clearing all fields separately.
     */
    initializeTemplate() {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

            this.#year = this.shadowRoot.getElementById("year");
            this.#energyPerCapita = this.shadowRoot.getElementById("energy-per-capita");
            this.#gdpPerCapita = this.shadowRoot.getElementById("gdp-per-capita");
    }

    /**
     * A function for updating the contents of template that is called by the browser when
     * the year attribute changes.
     */
    async attributeChangedCallback() {
        if(!this.energyRecordYear) {
                this.shadowRoot.innerHTML = "";

            return;
        }

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

// Define the EnergyDetail class as a custom element
window.customElements.define("energy-record-detail", EnergyDetail);