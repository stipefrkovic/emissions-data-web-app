/**
 * A custom element to show the summary of an temperature change record.
 * The current temperature change record attribute (e.g. ID) is stored as an attribute on the element itself.
 */
export default class TempChangeSummary extends HTMLElement {
    /**
     * Get and set the temperature change record ID attribute.
     */
    get tempChangeRecordId() {
        return this.getAttribute("temp-change-record-id");
    }

    set tempChangeRecordId(value) {
        if (value == null)
            this.removeAttribute("temp-change-record-id");
        else
            this.setAttribute("temp-change-record-id", value);
    }

    /**
     * Get and set the temperature change record year attribute.
     */
    get tempChangeRecordYear() {
        return this.getAttribute("temp-change-record-year");
    }

    set tempChangeRecordYear(value) {
        if (value == null)
            this.removeAttribute("temp-change-record-year");
        else
            this.setAttribute("temp-change-record-year", value);
    }


    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html element.
     */
    constructor() {
        super();

        const template = document.getElementById("temp-change-record-summary");
        const templateContent = template.content;

        // Prepare shadow DOM and fill it with the template contents
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
    }
};

// Define the TempChangeSummary class as a custom element
window.customElements.define("temp-change-record-summary", TempChangeSummary);