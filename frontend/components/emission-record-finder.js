import records from "../api/records.js";
import EmissionSummary from "./emission-record-summary.js";
// ApiGeneralSummary maybe needed
// GeneralSummary maybe needed

/**
 * This is a custom Event to represent an emission record being selected,
 * carrying a countryId field with it to represent which emission record is
 * being selected. This is used in the EmissionFinder element, to
 * inform the rest of the application that the user selected an emission record.
 */
export class EmissionRecordSelectedEvent extends Event {
  /** @type {number} */
  countryId;

  /**
   * @param {number} countryId
   */
  constructor(countryId) {
    // We call the parent constructor with a string representing
    // the name of this event. This is what we listen to.
    super("emission-record-selected");

    this.countryId = countryId;
  }
}

/**
 * This is a custom element representing an emission record finder as a whole.
 * It contains a small form where the user can enter a country name or ISO code and a year
 * to search for, and will show all matching results. The user can pick the
 * result, after which the element will emit a "emission-record-selected" event as
 * defined above.
 */
export default class EmissionRecordFinder extends HTMLElement {
  /** @type {HTMLInputElement} */ #countrySearch;
  /** @type {HTMLInputElement} */ #yearSearch;
  /** @type {HTMLButtonElement} */ #retrieve;
  /** @type {HTMLDivElement} */ #result;

  constructor() {
    super();

    // We start by finding the template and taking its contents.
    const template = document.getElementById("emission-record-finder");
    const templateContent = template.content;

    // Prepare shadow DOM and fill it with the template contents
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateContent.cloneNode(true));

    // Find elements inside the templates and cache them for
    // future reference.
    this.#countrySearch = this.shadowRoot.getElementById("country");
    this.#yearSearch = this.shadowRoot.getElementById("year");
    this.#retrieve = this.shadowRoot.getElementById("retrieve-emission");
    this.#result = this.shadowRoot.getElementById("emission-records");

    // Set up listeners to start search operation after every form
    // action.
    this.#retrieve.addEventListener("click", async () => {
      await this.search();
    });
  }

  /**
   * A function that extracts the values from the small input form and searches the
   * extracted information by calling the API. Once the necessary information has
   * been found, it is displayed on the web page using the EmissionSummary object.
   */
  async search() {
    let countryName = this.#countrySearch.value;
    let year = this.#yearSearch.value;

    /** @type {ApiRecordSummary[]} */
    let countryResult;
    try {
      countryResult = await records.getEmissionRecord(countryName, year);
    } catch (e) {
      alert(e);
      return;
    }

    // Clear old rendered results only after we received a new set of results, so
    // the front-end is always in a usable state.
    this.#result.innerHTML = "";

    // Build the new view: we instantiate an EmissionSummary custom element for every
    // result, and create four spans that connect to the four slots in EmissionSummary's
    // template.
    for (let country of countryResult) {
      // Create a new summary instance and set its attributes (for later reference)
      let emissionRecordView = new EmissionSummary();
      emissionRecordView.emissionRecordId = country.id;
      emissionRecordView.emissionRecordYear = country.year;

      // Connect slots: this is done by creating four spans
      // with the "slot" attribute set to match the slot name. We then put these four
      // spans inside the custom element as if they were child nodes - this is where
      // the shadow DOM will pull the slot values from. They are never displayed like
      // this directly, so the order or structure does not matter.
      let yearspan = document.createElement("span");
      yearspan.slot = "year";
      yearspan.innerText = country.year;

      let co2Span = document.createElement("span");
      co2Span.slot = "co2";
      co2Span.innerText = country.co2 != null ? country.co2 : "No Info";

      let methaneSpan = document.createElement("span");
      methaneSpan.slot = "methane";
      methaneSpan.innerText = country.methane != null ? country.methane : "No Info";

      let nitrousOxideSpan = document.createElement("span");
      nitrousOxideSpan.slot = "nitrous-oxide";
      nitrousOxideSpan.innerText = country.nitrousOxide != null ? country.nitrousOxide : "No Info";

      let totalGhgSpan = document.createElement("span");
      totalGhgSpan.slot = "total-ghg";
      totalGhgSpan.innerText = country.totalGhg != null ? country.totalGhg : "No Info";

      emissionRecordView.appendChild(yearspan);
      emissionRecordView.appendChild(co2Span);
      emissionRecordView.appendChild(methaneSpan);
      emissionRecordView.appendChild(nitrousOxideSpan);
      emissionRecordView.appendChild(totalGhgSpan);

      // Add an event listener: we want to trigger a "emission-record-selected" event when
      // the user clicks a specific emission record.
      emissionRecordView.addEventListener("click", () => {
        this.dispatchEvent(
          new EmissionRecordSelectedEvent(emissionRecordView.emissionRecordId)
        );
      });

      this.#result.appendChild(emissionRecordView);
    }
  }
}

// Define the EmissionRecordFinder class as a custom element.
window.customElements.define("emission-record-finder", EmissionRecordFinder);
