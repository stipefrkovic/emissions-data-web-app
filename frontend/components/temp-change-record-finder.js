import records from "../api/records.js";
import TempChangeSummary from "./temp-change-record-summary.js";
// ApiTempChangeSummary maybe needed
// TempChangeSummary maybe needed

// This is a custom Event to represent a movie being selected,
// carrying a movieId field with it to represent which movie is
// being selected. This is used in the MovieFinder element, to
// inform the rest of the application that the user selected a movie.
export class TempChangeRecordSelectedEvent extends Event {
    /** @type {number} */
    continentId;

    /**
     * @param {number} countinentId 
     */
    constructor(continentId) {
        // We call the parent constructor with a string representing
        // the name of this event. This is what we listen to.
        super("temp-change-record-selected");

        this.continentId = continentId;
    }
}

// This is a custom element representing a movie finder as a whole.
// It contains a small form where the user can enter a title and year
// to search for, and will show all matching results with pagination.
// The user can pick any of the results, after which the element will
// emit a "movie-selected" event as defined above.
export default class TempChangeRecordFinder extends HTMLElement {
    /** @type {HTMLInputElement} */ #continentSearch;
    /** @type {HTMLInputElement} */ #yearSearch;
    /** @type {HTMLButtonElement} */ #retrieve;
    /** @type {HTMLDivElement} */ #result;

    constructor() {
        // Always call the parent constructor!
        super();

        // We start by finding the template and taking its contents.
        const template = document.getElementById("temp-change-record-finder");
        const templateContent = template.content;

        // Prepare shadow DOM and fill it with the template contents
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));

        // Find elements inside the templates and cache them for
        // future reference.
        this.#continentSearch = this.shadowRoot.getElementById("continent");
        this.#yearSearch = this.shadowRoot.getElementById("year");
        this.#retrieve = this.shadowRoot.getElementById("retrieve-temp-change");
        this.#result = this.shadowRoot.getElementById("temp-records");


        // Set up listeners to start search operation after every form
        // action.
        this.#retrieve.addEventListener("click", async () => {
            await this.search();
        });
    }

    // This function will start a "getMovies" operation from the API. It will take the
    // local form state and get the appropriate results.
    async search() {
        let continentUncap = this.#continentSearch.value;
        const arr = continentUncap.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        
        }
        const continentName = arr.join(" ");
        let year = this.#yearSearch.value;

        /** @type {ApiRecordSummary[]} */
        let continentResult;
        try {
            continentResult = await records.getTempChangeRecord(continentName, year);
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
        for (let continent of continentResult) {
            // Create a new summary instance and set its ID (for later reference)
            let tempChangeRecordView = new TempChangeSummary();
            tempChangeRecordView.tempChangeRecordId = continentName;
            tempChangeRecordView.tempChangeRecordYear = continent.year;

            // Connect slots: this is done by creating two spans (can be arbitrary elements)
            // with the "slot" attribute set to match the slot name. We then put these two
            // spans inside the custom element as if they were child nodes - this is where
            // the shadow DOM will pull the slot values from. They are never displayed like
            // this directly, so the order or structure does not matter.
            let shareTempChangeSpan = document.createElement("span");
            shareTempChangeSpan.slot = "share-temp-change";
            shareTempChangeSpan.innerText = continent.shareOfTempChangeFromGhg;

            let tempChangeCo2Span = document.createElement("span");
            tempChangeCo2Span.slot = "temp-change-co2";
            tempChangeCo2Span.innerText = continent.tempChangeFromCO2;

            let tempChangeN2OSpan = document.createElement("span");
            tempChangeN2OSpan.slot = "temp-change-n2o";
            tempChangeN2OSpan.innerText = continent.tempChangeFromN2O;

            let tempChangeGhgSpan = document.createElement("span");
            tempChangeGhgSpan.slot = "temp-change-ghg";
            tempChangeGhgSpan.innerText = continent.tempChangeFromGHG;

            let tempChangeCh4Span = document.createElement("span");
            tempChangeCh4Span.slot = "temp-change-ch4";
            tempChangeCh4Span.innerText = continent.tempChangeFromCH4;

            tempChangeRecordView.appendChild(shareTempChangeSpan);
            tempChangeRecordView.appendChild(tempChangeCo2Span);
            tempChangeRecordView.appendChild(tempChangeN2OSpan);
            tempChangeRecordView.appendChild(tempChangeGhgSpan);
            tempChangeRecordView.appendChild(tempChangeCh4Span);

            // Add an event listener: we want to trigger a "movie-selected" event when
            // the user clicks a specific movie.
            tempChangeRecordView.addEventListener("click", () => {
                this.dispatchEvent(new TempChangeRecordSelectedEvent(tempChangeRecordView.id));
            });

            this.#result.appendChild(tempChangeRecordView);
        }
    }
};

// Define the MovieFinder class as a custom element
window.customElements.define('temp-change-record-finder', TempChangeRecordFinder);