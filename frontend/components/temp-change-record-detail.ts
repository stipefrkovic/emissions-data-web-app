import records from "../api/records.js";
import General from "../models/general.js";

/**
 * A custom element for a detailed temperature change record view.
 * The current temperature change record ID is stored as an attribute on the element itself.
 * when this ID changes, the view is recreated to reflect the information of the new record.
 */
export default class TempChangeDetail extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;

    /** @type {HTMLElement} */ #id;
    /** @type {HTMLElement} */ #year;
    /** @type {HTMLElement} */ #shareTempChange;
    /** @type {HTMLElement} */ #tempChangeCo2;
    /** @type {HTMLElement} */ #tempChangeN2O;
    /** @type {HTMLElement} */ #tempChangeGhg;
    /** @type {HTMLElement} */ #tempChangeCh4;

    /**
     * Get and set the temperature change record ID.
     */
    get tempChangeRecordId() {
        return this.getAttribute("temp-change-record-id");
    }

    set generalRecordId(value) {
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

    static get observedAttributes() {
        return ["temp-change-record-id", "temp-change-record-year"];
    }

    constructor() {
        super();

        this.#template = document.getElementById("temp-change-record-detail");
        this.attachShadow({ mode: "open" });

        this.initializeTemplate();
    }

    initializeTemplate() {
        if (this.shadowRoot != null) {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(this.#template.content.cloneNode(true));

            this.#id = this.shadowRoot.getElementById("country");
            this.#year = this.shadowRoot.getElementById("year");
            this.#shareTempChange = this.shadowRoot.getElementById("share-temp-change");
            this.#tempChangeCo2 = this.shadowRoot.getElementById("temp-change-co2");
            this.#tempChangeN2O = this.shadowRoot.getElementById("temp-change-n2o");
            this.#tempChangeGhg = this.shadowRoot.getElementById("temp-change-ghg");
            this.#tempChangeCh4 = this.shadowRoot.getElementById("temp-change-ch4");
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
            if (this.tempChangeRecordId != null && this.tempChangeRecordYear != null) {
                record = await records.getTempChangeRecord(this.tempChangeRecordId, this.tempChangeRecordYear);
            } else {
                alert("Temperature change record year (or id) is null (invalid value).");
            }
        } catch(e) {
            alert(e);
            return;
        }

        this.initializeTemplate();

        this.#id.innerText = record.id;
        this.#year.innerText = record.year;
        this.#shareTempChange = record.shareTempChange;
        this.#tempChangeCo2 = record.tempChangeCo2;
        this.#tempChangeN2O = record.tempChangeN2O;
        this.#tempChangeGhg = record.tempChangeGhg;
        this.#tempChangeCh4 = record.tempChangeCh4;
    }
};

window.customElements.define("temp-change-record-detail", TempChangeDetail);