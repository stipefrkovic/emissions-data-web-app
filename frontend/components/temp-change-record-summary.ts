/**
 * A custom element to show the summary of an temperature change record.
 * The current temperature change record ID is stored as an attribute on the element itself.
 */
export default class TempChangeSummary extends HTMLElement {
    /**
     * Get and set the temperature change record attribute.
     */
    get tempChangeRecordId() {
        return this.getAttribute("temp-change-record-id");
    }

    set tempChangeRecordId(value) {
        if(value == null)
            this.removeAttribute("temp-change-record-id");
        else
            this.setAttribute("temp-change-record-id", value);
    }

    /**
     * Get and set the temperature change record year.
     */
    get tempChangeRecordYear() {
        return this.getAttribute("temp-change-record-year");
    }

    set tempChangeRecordYear(value) {
        if(value == null)
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

        const template: HTMLElement | null = document.getElementById("temp-change-record-summary");
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

window.customElements.define("temp-change-record-summary", TempChangeSummary);