import records from "../api/records.js";
import CountrySummary from "./country-summary.js";

// This is a custom Event to represent a movie being selected,
// carrying a movieId field with it to represent which movie is
// being selected. This is used in the MovieFinder element, to
// inform the rest of the application that the user selected a movie.
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

// This is a custom element representing a movie finder as a whole.
// It contains a small form where the user can enter a title and year
// to search for, and will show all matching results with pagination.
// The user can pick any of the results, after which the element will
// emit a "movie-selected" event as defined above.
export default class CountryFinder extends HTMLElement {
    /** @type {HTMLInputElement} */ #numOfCountriesSearch;
    /** @type {HTMLSelectElement} */ #orderBySearch;
    /** @type {HTMLSelectElement} */ #orderSearch;
    /** @type {HTMLSelectElement} */ #periodTypeSearch;
    /** @type {HTMLInputElement} */ #periodValueSearch;
    /** @type {HTMLButtonElement} */ #retrieve;
    /** @type {HTMLDivElement} */ #result;

    constructor() {
        // Always call the parent constructor!
        super();
    
        // We start by finding the template and taking its contents.
        const template = document.getElementById("country-record-finder");
        const templateContent = template.content;
    
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
    
        // Find elements inside the templates and cache them for
        // future reference.
        this.#numOfCountriesSearch = this.shadowRoot.getElementById("num-of-countries");
        this.#orderBySearch = this.shadowRoot.getElementById("order-by");
        this.#orderSearch = this.shadowRoot.getElementById("order");
        this.#periodTypeSearch = this.shadowRoot.getElementById("period-type");
        this.#periodValueSearch = this.shadowRoot.getElementById("period-value");
        this.#result = this.shadowRoot.getElementById("records");
    
        // Set up listeners to start search operation after every form
        // action.
        this.#retrieve.addEventListener("click", async () => {
          await this.search();
        });
      }
    
      async search() {
        let numOfCountries = this.#numOfCountriesSearch.value;
        let orderBy = this.#orderBySearch.value;
        let order = this.#orderSearch.value;
        let periodType = this.#periodTypeSearch.value;
        let periodValue = this.#periodValueSearch.value;
    
        /** @type {} */
        let countryResult;
        try {
          countryResult = await records.getCountryRecord(numOfCountries, orderBy, order, periodType, periodValue);
        } catch (e) {
          alert(e);
          return;
        }
    
        //Clear view
        this.#result.innerHTML = "";
    
        // TO BE CONTINUED...
      }
    }
    
    // This function will start a "getMovies" operation from the API. It will take the
    // local form state and get the appropriate results.
    
    // Define the MovieFinder class as a custom element
    window.customElements.define("country-record-finder", CountryFinder);