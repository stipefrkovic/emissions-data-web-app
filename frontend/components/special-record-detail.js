import records from "../api/records.js";
import Special from "../models/special.js";

/**
 * A custom element for a detailed special record view.
 * The current special record ID is stored as an attribute on the element itself.
 * when this ID changes, the view is recreated to reflect the information of the new record.
 */
export default class SpecialDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #url;

    /**
     * Get and set the special record url.
     */
    get specialRecordUrl() {
        return this.getAttribute("special-record-url");
    }

    set specialRecordUrl(value) {
        if (value == null)
            this.removeAttribute("special-record-url");
        else
            this.setAttribute("special-record-url", value);
    }

    static get observedAttributes() {
        return ["special-record-url"];
    }

    constructor() {
        super();

        this.#template = document.getElementById("special-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    initializeTemplate() {
        if (this.shadowRoot != null) {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

            this.#url = this.shadowRoot.getElementById("emissions-csv-url");
        } else {
            alert("Shadow DOM ain't working (null error)!");
        }
    }

    async attributeChangedCallback() {
        if (!this.specialRecordUrl) {
            if (this.shadowRoot != null) {
                this.shadowRoot.innerHTML = "";
            } else {
                alert("Shadow DOM ain't working (null error)!");
            }
            return;
        }

        /** @type {Special} */
        let record;
        try {

            record = await records.getSpecialRecord(this.specialRecordUrl);
        } catch (e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#url.innerText = record.url;
    }
};

window.customElements.define("special-record-detail", GeneralDetail);