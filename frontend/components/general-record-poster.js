import records from "../api/records.js";
import GeneralSummary from "./general-record-summary.js";
import GeneralSelectedEvent from "./general-record-selected-event.js";

/**
 * A custom element representing a general record poster.
 * It contains a small form where the user can enter a
 * country name, year, GDP and population.
 * Summary information of the general record will be posted and displayed.
 */
export default class GeneralPoster extends HTMLElement {
  /** @type {HTMLInputElement} */ #country;
  /** @type {HTMLInputElement} */ #year;
  /** @type {HTMLInputElement} */ #gdp;
  /** @type {HTMLInputElement} */ #population;
  /** @type {HTMLButtonElement} */ #post;
  /** @type {HTMLDivElement} */ #result;

  /**
   * Constructs an instance of this class.
   * It initializes the fields by calling the corresponding html elements.
   */
  constructor() {
    super();

    // We start by finding the template and taking its contents.
    const template = document.getElementById("general-record-poster");
    const templateContent = template.content;

    // Initialize Shadow DOM.
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateContent.cloneNode(true));

    // Find elements inside the templates and cache them for
    // future reference.
    this.#country = this.shadowRoot.getElementById("country");
    this.#year = this.shadowRoot.getElementById("year");
    this.#gdp = this.shadowRoot.getElementById("gdp");
    this.#population = this.shadowRoot.getElementById("population");
    this.#post = this.shadowRoot.getElementById("post");
    this.#result = this.shadowRoot.getElementById("records");

    // Set up listeners to start search operation after every form
    // action.
    this.#post.addEventListener("click", async () => {
      await this.search();
    });
  }

  /**
   * A function that extracts the values from the small input form and posts the
   * new general record, if it didn't exist before, by calling the API. Once the necessary information has
   * been created, it is displayed on the web page using the GeneralSummary object.
   */
  async search() {
    let countryName = this.#country.value;
    let year = parseInt(this.#year.value);
    let gdp = parseInt(this.#gdp.value);
    let population = parseInt(this.#population.value);

    let countryResult;
    try {
      countryResult = await records.postGeneralRecord(
        countryName,
        year,
        gdp,
        population
      );
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
    // Create a new summary instance and set its attributes (for later reference)
    let recordView = new GeneralSummary();
    recordView.generalRecordId = countryName;
    recordView.generalRecordYear = year;

    // Connect slots: this is done by creating two spans
    // with the "slot" attribute set to match the slot name. We then put these two
    // spans inside the custom element as if they were child nodes - this is where
    // the shadow DOM will pull the slot values from.
    let countrySpan = document.createElement("span");
    countrySpan.slot = "country";
    countrySpan.innerText = countryName;

    let yearSpan = document.createElement("span");
    yearSpan.slot = "year";
    yearSpan.innerText = year;

    recordView.appendChild(countrySpan);
    recordView.appendChild(yearSpan);

    // Add an event listener: we want to trigger a "general-record-selected" event when
    // the user clicks a specific general record.
    recordView.addEventListener("click", () => {
      this.dispatchEvent(
        new GeneralSelectedEvent(
          recordView.generalRecordId,
          recordView.generalRecordYear
        )
      );
    });

    this.#result.appendChild(recordView);
  }
}

// Define the GeneralPoster class as a custom element
window.customElements.define("general-record-poster", GeneralPoster);
