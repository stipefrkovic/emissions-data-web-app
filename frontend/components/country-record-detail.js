import records from "../api/records.js";

/**
 * A custom element for a detailed country record view.
 * The current country record ID is stored as an attribute on the element itself.
 * when this ID changes, the view is recreated to reflect the information of the new record.
 */
export default class CountryDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #countryName;
    /** @type {HTMLElement} */ #shareTempChangeGhg;

    /**
     * Get and set the country record attribute.
     */
    get countryRecordNumOfCountries() {
        return this.getAttribute("country-record-num-of-countries");
    }

    set countryRecordNumOfCountries(value) {
        if (value == null)
            this.removeAttribute("country-record-num-of-countries");
        else
            this.setAttribute("country-record-num-of-countries", value);
    }

    /**
     * Get and set the country record period type.
     */
    get countryRecordPeriodType() {
        return this.getAttribute("country-record-period-type");
    }

    set countryRecordPeriodType(value) {
        if (value == null)
            this.removeAttribute("country-record-period-type");
        else
            this.setAttribute("country-record-period-type", value);
    }

    /**
     * Get and set the country record period value.
     */
    get countryRecordPeriodValue() {
        return this.getAttribute("country-record-period-value");
    }

    set countryRecordPeriodValue(value) {
        if (value == null)
            this.removeAttribute("country-record-period-value");
        else
            this.setAttribute("country-record-period-value", value);
    }

    static get observedAttributes() {
        return ["country-record-num-of-countries", "country-record-period-type", "country-record-period-value"];
    }

    constructor() {
        super();

        this.#template = document.getElementById("country-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    initializeTemplate() {
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

        this.#countryName = this.shadowRoot.getElementById("country");
        this.#shareTempChangeGhg = this.shadowRoot.getElementById("share-temp-change-ghg");
    }

    async attributeChangedCallback() {
        if (!this.energyRecordYear) {
            this.shadowRoot.innerHTML = "";

            return;
        }

        /** @type {} */
        let record;
        try {
            record = await records.getCountryRecord(this.energyRecordYear);

        } catch (e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#countryName.innerText = record.country;
        this.#shareTempChangeGhg = record.shareTempChangeGhg;
    }
};

window.customElements.define("country-record-detail", CountryDetail);