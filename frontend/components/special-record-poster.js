import records from "../api/records.js";
import SpecialSummary from "./special-record-summary.js";

// This is a custom Event to represent a record being selected,
// carrying a countryId field with it to represent which record is
// being selected. This is used in the record finder element, to
// inform the rest of the application that the user selected a record.
export class SpecialRecordSelectedEvent extends Event {
    /** @type {number} */
    specialRecordId;

    /**
     * @param {number} specialRecordId 
     */
    constructor(specialRecordId) {
        // We call the parent constructor with a string representing
        // the name of this event. This is what we listen to.
        super("special-record-selected");

        this.specialRecordId = specialRecordId;
    }
}

/**
 * A custom element representing a general record poster.
 * It contains a small form where the user can enter a
 * country name, year, GDP and population.
 * Summary information of the general record will be posted and displayed.
 */
export default class SpecialPoster extends HTMLElement {
  /** @type {HTMLInputElement} */ #url;
  /** @type {HTMLButtonElement} */ #post;
  /** @type {HTMLDivElement} */ #result;

    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html elements.
     */
    constructor() {
        // Always call the parent constructor!
        super();

        // We start by finding the template and taking its contents.
        const template = document.getElementById("special-record-poster");
        const templateContent = template.content;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
        // Find elements inside the templates and cache them for
        // future reference.
        this.#url = this.shadowRoot.getElementById("emissions-csv-url");
        this.#post = this.shadowRoot.getElementById("post");
        this.#result = this.shadowRoot.getElementById("special-records");

        this.#post.addEventListener("click", async () => {
            await this.search();
        });
    }

    async search() {
        let urlName = this.#url.value;

        /** @type {} */
        let specialResult;
        try {
            specialResult = await records.postSpecialRecord(urlName);
        } catch (e) {
            alert(e);
            return;
        }

        this.#result.innerHTML = "";

        let specialView = new SpecialSummary();
        specialView.specialRecordUrl = country.url;

        let urlSpan = document.createElement("span");
        urlSpan.slot = "csv-emissions-url";
        urlSpan.innerText = country.url;

        specialView.appendChild(urlSpan);

        specialView.addEventListener("click", () => {
            this.dispatchEvent(
                new SpecialRecordSelectedEvent(specialView.specialRecordUrl)
            );
        });

        this.#result.appendChild(specialView);
    }
}

window.customElements.define("special-record-poster", SpecialPoster);
