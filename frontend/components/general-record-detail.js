import records from "../api/records.js";
import General from "../models/general.js";

/**
 * A custom element for a detailed general record view.
 * Each current general record attributes (e.g. ID) is stored as an attribute on the element itself.
 * When this ID changes, the view is recreated to reflect the information of the new record.
 */
export default class GeneralDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #id;
    /** @type {HTMLElement} */ #year;
    /** @type {HTMLElement} */ #gdp;
    /** @type {HTMLElement} */ #population;

    /**
     * Get and set the general record ID attribute.
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
     * Get and set the general record year attribute.
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
     * This indicates to the browser that we want to be notified of any changes
     * to each attribute of a general record. The browser will then call "attributeChangedCallback"
     * for us. This will also be called when someone sets a new value to the property
     * above, since that set operation is translated into setting a new attribute
     * value.
     */
    static get observedAttributes() {
        return ["general-record-id", "general-record-year"];
    }

    /**
     * A constructor for setting up the proper template environment.
     */
    constructor() {
        super();

        this.#template = document.getElementById("general-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    /**
     * A function that clones the template and sets the HTML references. 
     * This allows to completely refresh the contents when loading a new general record, instead 
     * of clearing all fields separately.
     */
    initializeTemplate() {
        if (this.shadowRoot != null) {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

            this.#id = this.shadowRoot.getElementById("country");
            this.#year = this.shadowRoot.getElementById("year");
            this.#gdp = this.shadowRoot.getElementById("gdp");
            this.#population = this.shadowRoot.getElementById("population");
        } else {
            alert("Shadow DOM ain't working (null error)!");
        }
    }

    /**
     * A function for updating the contents of template that is called by the browser when
     * the ID or year attribute changes.
     */
    async attributeChangedCallback() {
        if(!this.generalRecordId || !this.generalRecordYear) {
            if (this.shadowRoot != null) {
                this.shadowRoot.innerHTML = "";
            } else {
                alert("Shadow DOM ain't working (null error)!");
            }
            return;
        }

        /** @type {General} */
        let record;
        try {
            if (this.generalRecordYear != null && this.generalRecordId != null) {
                record = await records.getGeneralRecord(this.generalRecordId, this.generalRecordYear);
            } else {
                alert("General record year is null (invalid value).");
            }
        } catch(e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#id.innerText = this.generalRecordId;
        this.#year.innerText = this.generalRecordYear;
        this.#gdp.innerText = record.gdp;
        this.#population.innerText = record.population;
    }
};

// Define the GeneralDetail class as a custom element
window.customElements.define("general-record-detail", GeneralDetail);