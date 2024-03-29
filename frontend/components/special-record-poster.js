import records from "../api/records.js";
import SpecialSummary from "./special-record-summary.js";

// This is a custom Event to represent a record being selected,
// carrying a specialRecordId field with it to represent which record is
// being selected. This is used in the SpecialPoster element, to
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
 * A custom element representing a special record updater.
 * It contains a small form where the user can enter a URL.
 * Summary information of the special record will be updated and displayed.
 */
export default class SpecialPoster extends HTMLElement {
  /** @type {HTMLInputElement} */ #url;
  /** @type {HTMLButtonElement} */ #put;
  /** @type {HTMLDivElement} */ #result;

    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html elements.
     */
    constructor() {
        super();

        // We start by finding the template and taking its contents.
        const template = document.getElementById("special-record-poster");
        const templateContent = template.content;

        // Initialize Shadow DOM.
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
        
        // Find elements inside the templates and cache them for
        // future reference.
        this.#url = this.shadowRoot.getElementById("emissions-csv-url");
        this.#put = this.shadowRoot.getElementById("put");
        this.#result = this.shadowRoot.getElementById("special-records");

        // Set up listeners to start search operation after every form
        // action.
        this.#put.addEventListener("click", async () => {
            await this.search();
        });
    }

    /**
     * A function that extracts the values from the small input form and either creates the
     * new special record or updates the existing one by calling the API. Once the necessary information has
     * been created, it is displayed on the web page using the SpecialSumamry object.
     */
    async search() {
        let urlName = this.#url.value;

        let specialResult;
        try {
            specialResult = await records.putSpecialRecord(urlName, document.getElementById("content-type").value);
        } catch (e) {
            alert(e);
            return;
        }

        // Clear old rendered results only after we received a new set of results, so
        // the front-end is always in a usable state.
        this.#result.innerHTML = "";

        // Build the new view: we instantiate a SpecialSumamry custom element for every
        // result, and create two spans that connect to the two slots in SpecialSummary's
        // template.
        let specialView = new SpecialSummary();
        specialView.specialRecordUrl = urlName;

        // Connect slots: this is done by creating one span 
        // with the "slot" attribute set to match the slot name. We then put this
        // span inside the custom element as if they were child nodes - this is where
        // the shadow DOM will pull the slot values from.
        let urlSpan = document.createElement("span");
        urlSpan.slot = "emissions-csv-url";
        urlSpan.innerText = urlName;

        specialView.appendChild(urlSpan);

        this.#result.appendChild(specialView);
    }
}

// Define the SpecialPoster class as a custom element
window.customElements.define("special-record-poster", SpecialPoster);
