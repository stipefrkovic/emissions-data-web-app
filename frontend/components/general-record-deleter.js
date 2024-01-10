/*import records from "../api/records.js";
import GeneralSummary from "./general-record-summary.js";
import GeneralSelectedEvent from "./general-record-selected-event.js";*/

/**
 * A custom element representing a general record deleter.
 * It contains a small form where the user can enter a country id.
 */
export default class GeneralDeleter extends HTMLElement {
  /** @type {HTMLInputElement} */ #countrySearch;
  /** @type {HTMLInputElement} */ #yearSearch;
  /** @type {HTMLButtonElement} */ #delete;
  /** @type {HTMLDivElement} */ #result;

  /**
   * Constructs an instance of this class.
   * It initializes the fields by calling the corresponding html elements.
   */
  constructor() {
    super();

    // We start by finding the template and taking its contents.
    const template = document.getElementById("general-record-deleter");
    const templateContent = template.content;

    // Prepare shadow DOM and fill it with the template contents
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateContent.cloneNode(true));

    // Find elements inside the templates and cache them for
    // future reference.
    this.#countrySearch = this.shadowRoot.getElementById("country");
    this.#yearSearch = this.shadowRoot.getElementById("year");
    this.#delete = this.shadowRoot.getElementById("delete");
    this.#result = this.shadowRoot.getElementById("records");

    //Search when the button is clicked
    this.#delete.addEventListener("click", async () => {
      await this.search();
    });
  }

  async search() {
    let countryName = this.#countrySearch.value;
    let year = this.#yearSearch.value;

    /** @type {} */
    let countryResult;
    try {
      countryResult = await records.deleteGeneralRecord(countryName, year);
    } catch (e) {
      alert(e);
      return;
    }

    //Clear view
    this.#result.innerHTML = "";

    //Build new view
    for (let country of countryResult) {
      let recordView = new GeneralSummary();
      recordView.generalRecordId = country.id;
      recordView.generalRecordYear = country.year;

      let countrySpan = document.createElement("span");
      countrySpan.slot = "country";
      countrySpan.innerText = country.id;

      let yearSpan = document.createElement("span");
      yearSpan.slot = "year";
      yearSpan.innerText = country.year;

      recordView.appendChild(countrySpan);
      recordView.appendChild(yearSpan);

      recordView.addEventListener("click", () => {
        this.dispatchEvent(
          new GeneralSelectedEvent(recordView.generalRecordId)
        );
      });

      this.#result.appendChild(recordView);
    }
  }
}

window.customElements.define("general-record-deleter", GeneralDeleter);
