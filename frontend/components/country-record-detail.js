import records from "../api/records.js";

/**
 * A custom element for a detailed country record view.
 * Each current country record attribute (e.g. number of countries) is stored 
 * as an attribute on the element itself. When the number of countries attribute 
 * changes, the view is recreated to reflect the information of the new record.
 */
export default class CountryDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #countryName;
    /** @type {HTMLElement} */ #shareTempChangeGhg;

    /**
     * Get and set the country record number of countries attribute.
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
     * Get and set the country record order by.
     */
    get countryRecordOrderBy() {
        return this.getAttribute("country-record-order-by");
    }

    set countryRecordOrderBy(value) {
        if (value == null)
            this.removeAttribute("country-record-order-by");
        else
            this.setAttribute("country-record-order-by", value);
    }

    /**
     * Get and set the country record order.
     */
    get countryRecordOrder() {
        return this.getAttribute("country-record-order");
    }

    set countryRecordOrder(value) {
        if (value == null)
            this.removeAttribute("country-record-order");
        else
            this.setAttribute("country-record-order", value);
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

    /**
     * This indicates to the browser that we want to be notified of any changes
     * to each attribute of a country record. The browser will then call "attributeChangedCallback"
     * for us. This will also be called when someone sets a new value to the property
     * above, since that set operation is translated into setting a new attribute
     * value.
     */
    static get observedAttributes() {
        return ["country-record-num-of-countries", "country-record-order-by", "country-record-order", "country-record-period-type", 
        "country-record-period-value"];
    }

    /**
     * A constructor for setting up the proper template environment.
     */
    constructor() {
        super();

        this.#template = document.getElementById("country-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    /**
     * A function that clones the template and sets the HTML references. 
     * This allows to completely refresh the contents when loading a new country record, instead 
     * of clearing all fields separately.
     */
    initializeTemplate() {
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

        this.#countryName = this.shadowRoot.getElementById("country");
        this.#shareTempChangeGhg = this.shadowRoot.getElementById("share-temp-change-ghg");
    }

    /**
     * A function for updating the contents of template that is called by the browser when
     * the number of countries attribute changes.
     */
    async attributeChangedCallback() {
        if (!this.countryRecordNumOfCountries) {
            this.shadowRoot.innerHTML = "";

            return;
        }

        let record;
        try {
            record = await records.getCountryRecord(this.countryRecordNumOfCountries, this.countryRecordOrderBy, this.countryRecordOrder,
                this.countryRecordPeriodType, this.countryRecordPeriodValue);

        } catch (e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#countryName.innerText = record.country;
        this.#shareTempChangeGhg.innerText = record.share_of_temperature_change_from_ghg;
    }
};

// Define the CountryDetail class as a custom element
window.customElements.define("country-record-detail", CountryDetail);