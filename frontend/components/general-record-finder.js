import records from "../api/records.js";
import GeneralSummary from "./general-record-summary.js";
import GeneralSelectedEvent from "./general-record-selected-event.js";

// This is a custom element representing a movie finder as a whole.
// It contains a small form where the user can enter a title and year
// to search for, and will show all matching results with pagination.
// The user can pick any of the results, after which the element will
// emit a "movie-selected" event as defined above.
export default class GeneralFinder extends HTMLElement {
  /** @type {HTMLInputElement}*/ #countrySearch;
  /** @type {HTMLInputElement}*/ #yearSearch;
  /** @type {HTMLButtonElement}*/ #retrieve;
  /** @type {HTMLDivElement}*/ #result;

  constructor() {
    // Always call the parent constructor!
    super();

    // We start by finding the template and taking its contents.
    const template = document.getElementById("general-record-finder");
    const templateContent = template.content;

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

    //Clear view
    this.#result.innerHTML = "";

    //Build new view
    let recordView = new GeneralSummary();
    recordView.generalRecordId = countryName;
    recordView.generalRecordYear = year;

    let countrySpan = document.createElement("span");
    countrySpan.slot = "country";
    countrySpan.innerText = countryName

    let yearSpan = document.createElement("span");
    yearSpan.slot = "year";
    yearSpan.innerText = year

    recordView.appendChild(countrySpan);
    recordView.appendChild(yearSpan);

    recordView.addEventListener("click", () => {
      this.dispatchEvent(new GeneralSelectedEvent(recordView.generalRecordId, recordView.generalRecordYear));
    });

    this.#result.appendChild(recordView);
  }
}

// This function will start a "getMovies" operation from the API. It will take the
// local form state and get the appropriate results.

// Define the MovieFinder class as a custom element
window.customElements.define("general-record-finder", GeneralFinder);
