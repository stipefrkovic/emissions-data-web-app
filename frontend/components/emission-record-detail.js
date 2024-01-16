//import records from "../api/records.js";
//import General from "../models/general.js";

/**
 * A custom element for a detailed emission record view.
 * Each current emission record attribute (e.g. ID) is stored as an attribute on the element itself.
 * When this ID changes, the view is recreated to reflect the information of the new record.
 */
export default class EmissionDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #id;
    /** @type {HTMLElement} */ #year;
    /** @type {HTMLElement} */ #co2;
    /** @type {HTMLElement} */ #methane;
    /** @type {HTMLElement} */ #nitrousOxide;
    /** @type {HTMLElement} */ #totalGhg;

    /**
     * Get and set the emission record ID attribute.
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
     * Get and set the emission record year attribute.
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
     * This indicates to the browser that we want to be notified of any changes
     * to each attribute of a emission record. The browser will then call "attributeChangedCallback"
     * for us. This will also be called when someone sets a new value to the property
     * above, since that set operation is translated into setting a new attribute
     * value.
     */
    static get observedAttributes() {
        return ["emission-record-id", "emission-record-year"];
    }

    /**
     * A constructor for setting up the proper template environment.
     */
    constructor() {
        super();

        this.#template = document.getElementById("emission-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    /**
     * A function that clones the template and sets the HTML references. 
     * This allows to completely refresh the contents when loading a new emission record, instead 
     * of clearing all fields separately.
     */
    initializeTemplate() {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

            this.#id = this.shadowRoot.getElementById("country");
            this.#year = this.shadowRoot.getElementById("year");
            this.#co2 = this.shadowRoot.getElementById("co2");
            this.#methane = this.shadowRoot.getElementById("methane");
            this.#nitrousOxide = this.shadowRoot.getElementById("nitrous-oxide");
            this.#totalGhg = this.shadowRoot.getElementById("total-ghg");
    }

    /**
     * A function for updating the contents of template that is called by the browser when
     * the ID attribute changes.
     */
    async attributeChangedCallback() {
        if(!this.emissionRecordId) {
                this.shadowRoot.innerHTML = "";
            return;
        }

        /** @type {General} */
        let record;
        try {
                record = await records.getGeneralRecord(this.emissionRecordId, this.emissionRecordYear);
        } catch(e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#id.innerText = record.id;
        this.#year.innerText = record.year;
        this.#co2.innerText = record.co2;
        this.#methane.innerText = record.methane;
        this.#nitrousOxide.innerText = record.nitrousOxide;
        this.#totalGhg.innerText = record.totalGhg;
    }
};

// Define the EmissionDetail class as a custom element
window.customElements.define("emission-record-detail", EmissionDetail);