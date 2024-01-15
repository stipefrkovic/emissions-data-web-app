import records from "../api/records.js";
import GeneralSummary from "./general-record-summary.js";
import GeneralSelectedEvent from "./general-record-selected-event.js";

/**
 * This is a custom element representing a general record finder as a whole.
 * It contains a small form where the user can enter a country name or ISO code and a year
 * to search for, and will show all matching results. The user can pick any of 
 * the results, after which the element will emit a "general-record-selected" event as 
 * defined above.
 */
export default class GeneralFinder extends HTMLElement {
  /** @type {HTMLInputElement}*/ #countrySearch;
  /** @type {HTMLInputElement}*/ #yearSearch;
  /** @type {HTMLButtonElement}*/ #retrieve;
  /** @type {HTMLDivElement}*/ #result;

  constructor() {
    super();

    // We start by finding the template and taking its contents.
    const template = document.getElementById("general-record-finder");
    const templateContent = template.content;

    // Initialize Shadow DOM.
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateContent.cloneNode(true));

    // Find elements inside the templates and cache them for
    // future reference.
    this.#countrySearch = this.shadowRoot.getElementById("country");
    this.#yearSearch = this.shadowRoot.getElementById("year");
    this.#retrieve = this.shadowRoot.getElementById("retrieve");
    this.#result = this.shadowRoot.getElementById("records");

    // Set up listeners to start search operation after every form
    // action.
    this.#retrieve.addEventListener("click", async () => {
      await this.search();
    });
  }

  /**
   * A function that extracts the values from the small input form and searches the
   * extracted information by calling the API. Once the necessary information has
   * been found, it is displayed on the web page using the GeneralSummary object.
   */
  async search() {
    let countryName = this.#countrySearch.value;
    let year = this.#yearSearch.value;

    /** @type {} */
    let countryResult;
    try {
      countryResult = await records.getGeneralRecord(countryName, year);
    } catch (e) {
      alert(e);
      return;
    }

    // Clear old rendered results only after we received a new set of results, so
    // the front-end is always in a usable state.
    this.#result.innerHTML = "";

    // Build the new view: we instantiate a GeneralSummary custom element for every
    // result, and create two spans that connect to the two slots in GeneralSummary's
    // template.
    let recordView = new GeneralSummary();
    recordView.generalRecordId = countryName;
    recordView.generalRecordYear = year;

    // Connect slots: this is done by creating two spans 
    // with the "slot" attribute set to match the slot name. We then put these two
    // spans inside the custom element as if they were child nodes - this is where
    // the shadow DOM will pull the slot values from.
    let countrySpan = document.createElement("span");
    countrySpan.slot = "country";
    countrySpan.innerText = countryName

    let yearSpan = document.createElement("span");
    yearSpan.slot = "year";
    yearSpan.innerText = year

    recordView.appendChild(countrySpan);
    recordView.appendChild(yearSpan);

    // Add an event listener: we want to trigger a "general-record-selected" event when
    // the user clicks a specific general record.
    recordView.addEventListener("click", () => {
      this.dispatchEvent(new GeneralSelectedEvent(recordView.generalRecordId, recordView.generalRecordYear));
    });

    this.#result.appendChild(recordView);
  }
}

// Define the GeneralFinder class as a custom element
window.customElements.define("general-record-finder", GeneralFinder);
