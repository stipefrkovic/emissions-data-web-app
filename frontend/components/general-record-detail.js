import records from "../api/records.js";
import General from "../models/general.js";

/**
 * A custom element for a detailed general record view.
 * The current general record ID is stored as an attribute on the element itself.
 * when this ID changes, the view is recreated to reflect the information of the new record.
 */
export default class GeneralDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #id;
    /** @type {HTMLElement} */ #year;
    /** @type {HTMLElement} */ #gdp;
    /** @type {HTMLElement} */ #population;

    /**
     * Get and set the general record ID.
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

    static get observedAttributes() {
        return ["general-record-id", "general-record-year"];
    }

    constructor() {
        super();

        this.#template = document.getElementById("general-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

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

    async attributeChangedCallback() {
        if(!this.generalRecordId) {
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
            if (this.generalRecordYear != null) {
                record = await records.getGeneralRecord(this.generalRecordId, this.generalRecordYear);
            } else {
                alert("General record year is null (invalid value).");
            }
        } catch(e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#id.innerText = record.id;
        this.#year.innerText = record.year;
        this.#gdp.innerText = record.gdp;
        this.#population.innerText = record.population;
    }
};

window.customElements.define("general-record-detail", GeneralDetail);