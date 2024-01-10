/**
 * A custom element to show the summary of a general record.
 * The current general record ID is stored as an attribute on the element itself.
 */
export default class GeneralSummary extends HTMLElement {
    /**
     * Get and set the general record attribute.
     */
    get generalRecordId() {
        return this.getAttribute("general-record-id");
    }

    set generalRecordId(value) {
        if(value == null)
            this.removeAttribute("general-record-id");
        else
            this.setAttribute("general-record-id", value);
    }

    /**
     * Get and set the general record year.
     */
    get generalRecordYear() {
        return this.getAttribute("general-record-year");
    }

    set generalRecordYear(value) {
        if(value == null)
            this.removeAttribute("general-record-year");
        else
            this.setAttribute("general-record-year", value);
    }


    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html element.
     */
    constructor() {
        super();

        const template: HTMLElement | null = document.getElementById("general-record-summary");
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

window.customElements.define("general-record-summary", GeneralSummary);