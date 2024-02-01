/**
 * A custom element to show the summary of a country record.
 * Each current country attribute (e.g. number of countries) is 
 * stored as an attribute on the element itself.
 */
export default class CountrySummary extends HTMLElement {
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
     * Get and set the country record order by attribute.
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
     * Get and set the country record order attribute.
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
     * Get and set the country record period type attribute.
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
     * Get and set the country record period value attribute.
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
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html element.
     */
    constructor() {
        super();

        const template = document.getElementById("country-record-summary");
        const templateContent = template.content;

        // Prepare shadow DOM and fill it with the template contents
        this.attachShadow({ mode: "open" });
        if (this.shadowRoot != null) {
            this.shadowRoot.appendChild((templateContent).cloneNode(true));
        } else {
            alert("Shadow DOM ain't working (null error)!");
        }
    }
};

// Define the CountrySummary class as a custom element
window.customElements.define("country-record-summary", CountrySummary);