/**
 * A custom element to show the summary of an emission record.
 * The current emission record ID is stored as an attribute on the element itself.
 */
export default class EmissionSummary extends HTMLElement {
    /**
     * Get and set the emission record attribute.
     */
    get emissionRecordId() {
        return this.getAttribute("emission-record-id");
    }

    set emissionRecordId(value) {
        if (value == null)
            this.removeAttribute("emission-record-id");
        else
            this.setAttribute("emission-record-id", value);
    }

    /**
     * Get and set the emission record year.
     */
    get emissionRecordYear() {
        return this.getAttribute("emission-record-year");
    }

    set emissionRecordYear(value) {
        if (value == null)
            this.removeAttribute("emission-record-year");
        else
            this.setAttribute("emission-record-year", value);
    }


    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html element.
     */
    constructor() {
        super();

        const template = document.getElementById("emission-record-summary");
        const templateContent = template.content;

        // Prepare shadow DOM and fill it with the template contents
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
    }
};

window.customElements.define("emission-record-summary", EmissionSummary);