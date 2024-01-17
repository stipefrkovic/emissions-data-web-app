import records from "../api/records.js";
import CountrySummary from "./country-record-summary.js";

/**
 * This is a custom Event to represent a country record being selected,
 * carrying a countryId field with it to represent which country record is
 * being selected. This is used in the CountryFinder element, to
 * inform the rest of the application that the user selected a country record.
 */
export class CountryRecordSelectedEvent extends Event {
    /** @type {number} */
    countryId;

    /**
     * @param {number} countryId 
     */
    constructor(countryId) {
        // We call the parent constructor with a string representing
        // the name of this event. This is what we listen to.
        super("country-record-selected");

        this.countryId = countryId;
    }
}

/**
 * This is a custom element representing a country record finder as a whole.
 * It contains a small form where the user can enter a number of countries,
 * how to order by, on what the order is based, a period type and a period value
 * to search for, and will show all matching results. The user can pick any of 
 * the results, after which the element will emit a "country-record-selected" event as 
 * defined above.
 */
export default class CountryFinder extends HTMLElement {
    /** @type {HTMLInputElement} */ #numOfCountriesSearch;
    /** @type {HTMLSelectElement} */ #orderBySearch;
    /** @type {HTMLSelectElement} */ #orderSearch;
    /** @type {HTMLSelectElement} */ #periodTypeSearch;
    /** @type {HTMLInputElement} */ #periodValueSearch;
    /** @type {HTMLButtonElement} */ #retrieve;
    /** @type {HTMLDivElement} */ #result;

    constructor() {
        super();
    
        // We start by finding the template and taking its contents.
        const template = document.getElementById("country-record-finder");
        const templateContent = template.content;
    
        // Initialize Shadow DOM.
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
    
        // Find elements inside the templates and cache them for
        // future reference.
        this.#numOfCountriesSearch = this.shadowRoot.getElementById("n-countries");
        this.#orderBySearch = this.shadowRoot.getElementById("order-by-options");
        this.#orderSearch = this.shadowRoot.getElementById("order-options");
        this.#periodTypeSearch = this.shadowRoot.getElementById("period-type-options");
        this.#periodValueSearch = this.shadowRoot.getElementById("period-value");
        this.#retrieve = this.shadowRoot.getElementById("retrieve-country");
        this.#result = this.shadowRoot.getElementById("country-records");
    
        // Set up listeners to start search operation after every form
        // action.
        this.#retrieve.addEventListener("click", async () => {
          await this.search();
        });
      }
    
      /**
       * A function that extracts the values from the small input form and searches the
       * extracted information by calling the API. Once the necessary information has
       * been found, it is displayed on the web page using the CountrySummary object.
       */
      async search() {
        let numOfCountries = parseInt(this.#numOfCountriesSearch.value);
        let orderBy = this.#orderBySearch.value;
        let order = this.#orderSearch.value;
        let periodType = this.#periodTypeSearch.value;
        let periodValue = this.#periodValueSearch.value;
    
        let countryResult;
        try {
          countryResult = await records.getCountryRecord(numOfCountries, orderBy, order, periodType, periodValue, document.getElementById("content-type").value);
        } catch (e) {
          alert(e);
          return;
        }
    
        // Clear old rendered results only after we received a new set of results, so
        // the front-end is always in a usable state.
        this.#result.innerHTML = "";
        
        // Build the new view: we instantiate a CountrySummary custom element for every
        // result, and create two spans that connect to the two slots in CountrySummary's
        // template.
        for (let countryIt of countryResult) {
          // Create a new summary instance and set its attributes (for later reference)
          let countryRecordView = new CountrySummary();
          countryRecordView.countryRecordNumOfCountries = countryIt.numOfCountries;
          countryRecordView.countryRecordOrderBy = countryIt.orderBy;
          countryRecordView.countryRecordOrder = countryIt.order;
          countryRecordView.countryRecordPeriodType = countryIt.periodType;
          countryRecordView.countryRecordPeriodValue = countryIt.periodValue;

          // Connect slots: this is done by creating two spans 
          // with the "slot" attribute set to match the slot name. We then put these two
          // spans inside the custom element as if they were child nodes - this is where
          // the shadow DOM will pull the slot values from.
          let countryNameSpan = document.createElement("span");
          countryNameSpan.slot = "country";
          countryNameSpan.innerText = countryIt.name;

          let shareTempChangeGhgSpan = document.createElement("span");
          shareTempChangeGhgSpan.slot = "share-temp-change-ghg";
          shareTempChangeGhgSpan.innerText = countryIt.shareOfTempChangeFromGhg != null ? countryIt.shareOfTempChangeFromGhg : "No info";

          countryRecordView.appendChild(countryNameSpan);
          countryRecordView.appendChild(shareTempChangeGhgSpan);

          // Add an event listener: we want to trigger a "country-record-selected" event when
          // the user clicks a specific country record.
          countryRecordView.addEventListener("click", () => {
              this.dispatchEvent(new CountryRecordSelectedEvent(countryRecordView.countryRecordId));
          });

          this.#result.appendChild(countryRecordView);
      }
      }
    }
    
    // Define the CountryFinder class as a custom element
    window.customElements.define("country-record-finder", CountryFinder);