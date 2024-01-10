/**
 * A custom element to show the summary of an energy record.
 * The current energy record ID is stored as an attribute on the element itself.
 */
export default class EnergySummary extends HTMLElement {
    /**
     * Get and set the energy record year.
     */
    get energyRecordYear() {
        return this.getAttribute("energy-record-year");
    }

    set energyRecordYear(value) {
        if (value == null)
            this.removeAttribute("energy-record-year");
        else
            this.setAttribute("energy-record-year", value);
    }


    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html element.
     */
    constructor() {
        super();

        const template = document.getElementById("energy-record-summary");
        const templateContent = template.content;

        // Prepare shadow DOM and fill it with the template contents
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
    }
};

window.customElements.define("energy-record-summary", EnergySummary);