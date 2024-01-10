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
        if(value == null)
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
        if(value == null)
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

        const template: HTMLElement | null = document.getElementById("emission-record-summary");
        if (template instanceof HTMLMetaElement) {
            const templateContent = template.content;

            // Prepare shadow DOM and fill it with the template contents
            this.attachShadow({ mode: "open" });
            if (this.shadowRoot != null) {
                this.shadowRoot.appendChild((templateContent as any).cloneNode(true));
            } else {
                alert("Shadow DOM ain't working (null error)!");
            }
        } else {
            alert("Template is not working (null).");
        }
    }
};

window.customElements.define("emission-record-summary", EmissionSummary);