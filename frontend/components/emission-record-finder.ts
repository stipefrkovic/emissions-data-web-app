import records from "../api/records.ts";
import EmissionSummary from "./emission-record-summary.ts";
// ApiGeneralSummary maybe needed
// GeneralSummary maybe needed

// This is a custom Event to represent a movie being selected,
// carrying a movieId field with it to represent which movie is
// being selected. This is used in the MovieFinder element, to
// inform the rest of the application that the user selected a movie.
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

// This is a custom element representing a movie finder as a whole.
// It contains a small form where the user can enter a title and year
// to search for, and will show all matching results with pagination.
// The user can pick any of the results, after which the element will
// emit a "movie-selected" event as defined above.
export default class EmissionRecordFinder extends HTMLElement {
    /** @type {HTMLInputElement} */ #countrySearch;
    /** @type {HTMLInputElement} */ #yearSearch;
    /** @type {HTMLButtonElement} */ #retrieve;
    /** @type {HTMLDivElement} */ #result;

    constructor() {
        // Always call the parent constructor!
        super();

        // We start by finding the template and taking its contents.
        const template: HTMLElement | null = document.getElementById("emission-record-finder");
        if (template instanceof HTMLMetaElement) {
            const templateContent = template.content;

            // Prepare shadow DOM and fill it with the template contents
            this.attachShadow({ mode: "open" });
            if (this.shadowRoot != null) {
                this.shadowRoot.appendChild((templateContent as any).cloneNode(true));

                // Find elements inside the templates and cache them for
                // future reference.
                this.#countrySearch = this.shadowRoot.getElementById("country");
                this.#yearSearch = this.shadowRoot.getElementById("year");
                this.#retrieve = this.shadowRoot.getElementById("retrieve-emission");
                this.#result = this.shadowRoot.getElementById("emission-records");
            } else {
                alert("Shadow DOM ain't working (null error)!");
            }
        } else {
            alert("Template is not working (null).");
        }

        // Set up listeners to start search operation after every form
        // action.
        this.#retrieve.addEventListener("click", async () => {
            await this.search();
        });
    }

    // This function will start a "getMovies" operation from the API. It will take the
    // local form state and get the appropriate results.
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

        // Build the new view: we instantiate a MovieSummary custom element for every
        // result, and create two spans that connect to the two slots in MovieSummary's
        // template.
        for (let country of countryResult) {
            // Create a new summary instance and set its ID (for later reference)
            let emissionRecordView = new EmissionSummary();
            emissionRecordView.emissionRecordId = country.id;
            emissionRecordView.emissionRecordYear = country.year;

            // Connect slots: this is done by creating two spans (can be arbitrary elements)
            // with the "slot" attribute set to match the slot name. We then put these two
            // spans inside the custom element as if they were child nodes - this is where
            // the shadow DOM will pull the slot values from. They are never displayed like
            // this directly, so the order or structure does not matter.
            let co2Span = document.createElement("span");
            co2Span.slot = "co2";
            co2Span.innerText = country.co2;

            let methaneSpan = document.createElement("span");
            methaneSpan.slot = "methane";
            methaneSpan.innerText = country.methane;

            let nitrousOxideSpan = document.createElement("span");
            nitrousOxideSpan.slot = "nitrous-oxide";
            nitrousOxideSpan.innerText = country.nitrousOxide;

            let totalGhgSpan = document.createElement("span");
            totalGhgSpan.slot = "total-ghg";
            totalGhgSpan.innerText = country.totalGhg;

            emissionRecordView.appendChild(co2Span);
            emissionRecordView.appendChild(methaneSpan);
            emissionRecordView.appendChild(nitrousOxideSpan);
            emissionRecordView.appendChild(totalGhgSpan);

            // Add an event listener: we want to trigger a "movie-selected" event when
            // the user clicks a specific movie.
            emissionRecordView.addEventListener("click", () => {
                this.dispatchEvent(new EmissionRecordSelectedEvent(emissionRecordView.emissionRecordId));
            });

            this.#result.appendChild(emissionRecordView);
        }
    }
};

// Define the MovieFinder class as a custom element
window.customElements.define('general-record-finder', EmissionRecordFinder);