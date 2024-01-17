import records from "../api/records.js";
import Special from "../models/special.js";

/**
 * A custom element for a detailed special record view.
 * The current special record URL is stored as an attribute on the element itself.
 * When this URL changes, the view is recreated to reflect the information of the new record.
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

    /**
     * This indicates to the browser that we want to be notified of any changes
     * to each attribute of a special record. The browser will then call "attributeChangedCallback"
     * for us. This will also be called when someone sets a new value to the property
     * above, since that set operation is translated into setting a new attribute
     * value.
     */
    static get observedAttributes() {
        return ["special-record-url"];
    }

    /**
     * A constructor for setting up the proper template environment.
     */
    constructor() {
        super();

        this.#template = document.getElementById("special-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    /**
     * A function that clones the template and sets the HTML references. 
     * This allows to completely refresh the contents when loading a new special record, instead 
     * of clearing all fields separately.
     */
    initializeTemplate() {
        if (this.shadowRoot != null) {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

            this.#url = this.shadowRoot.getElementById("emissions-csv-url");
        } else {
            alert("Shadow DOM ain't working (null error)!");
        }
    }

    /**
     * A function for updating the contents of template that is called by the browser when
     * the number of countries attribute changes.
     */
    async attributeChangedCallback() {
        if (!this.specialRecordUrl) {
            if (this.shadowRoot != null) {
                this.shadowRoot.innerHTML = "";
            } else {
                alert("Shadow DOM ain't working (null error)!");
            }
            return;
        }

        let record;
        try {

            record = await records.putSpecialRecord(this.specialRecordUrl);
        } catch (e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#url.innerText = record.url;
    }
};

// Define the SpecialDetail class as a custom element
window.customElements.define("special-record-detail", SpecialDetail);