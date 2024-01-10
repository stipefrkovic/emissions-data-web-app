//import records from "../api/records.js";
//import General from "../models/general.js";

/**
 * A custom element for a detailed emission record view.
 * The current emission record ID is stored as an attribute on the element itself.
 * when this ID changes, the view is recreated to reflect the information of the new record.
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
     * Get and set the emission record ID.
     */
    get emissionRecordId() {
        return this.getAttribute("emission-record-id");
    }

    set generalRecordId(value) {
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

    static get observedAttributes() {
        return ["emission-record-id", "emission-record-year"];
    }

    constructor() {
        super();

        this.#template = document.getElementById("emission-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

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

    async attributeChangedCallback() {
        if(!this.generalRecordId) {
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

window.customElements.define("emission-record-detail", EmissionDetail);