/**
 * A custom element to show the summary of a country record.
 * The current country record ID is stored as an attribute on the element itself.
 */
export default class CountrySummary extends HTMLElement {
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

window.customElements.define("country-record-summary", CountrySummary);