/**
 * A custom element to show the summary of a special record.
 * The current special record ID is stored as an attribute on the element itself.
 */
export default class SpecialSummary extends HTMLElement {
    /**
     * Get and set the special record attribute.
     */
    get specialRecordUrl() {
        return this.getAttribute("special-record-url");
    }

    set specialRecordUrl(value) {
        if(value == null)
            this.removeAttribute("special-record-url");
        else
            this.setAttribute("special-record-url", value);
    }


    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html element.
     */
    constructor() {
        super();

        const template = document.getElementById("special-record-summary");
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

window.customElements.define("special-record-summary", GeneralSummary);