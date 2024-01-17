import records from "../api/records.js";
import TempChangeSummary from "./temp-change-record-summary.js";


/**
 * This is a custom element representing a temperature change record finder as a whole.
 * It contains a small form where the user can enter a continent name and a year
 * to search for, and will show all matching results. The user can pick any of 
 * the results, after which the element will emit a "temp-change-record-selected" event as 
 * defined above.
 */
export default class TempChangeRecordFinder extends HTMLElement {
    /** @type {HTMLInputElement} */ #continentSearch;
    /** @type {HTMLInputElement} */ #yearSearch;
    /** @type {HTMLButtonElement} */ #retrieve;
    /** @type {HTMLDivElement} */ #result;

    constructor() {
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

    /**
     * A function that extracts the values from the small input form and searches the
     * extracted information by calling the API. Once the necessary information has
     * been found, it is displayed on the web page using the TempChangeSummary object.
     */
    async search() {
        let continentUncap = this.#continentSearch.value;
        const arr = continentUncap.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        
        }
        const continentName = arr.join(" ");
        let year = this.#yearSearch.value;

        let continentResult;
        try {
            continentResult = await records.getTempChangeRecord(continentName, year, document.getElementById("content-type").value);
        } catch (e) {
            alert(e);
            return;
        }

        // Clear old rendered results only after we received a new set of results, so
        // the front-end is always in a usable state.
        this.#result.innerHTML = "";

        // Build the new view: we instantiate a TempChangeSummary custom element for every
        // result, and create five spans that connect to the five slots in TempChangeSummary's
        // template.
        for (let continent of continentResult) {
            // Create a new summary instance and set its attributes (for later reference)
            let tempChangeRecordView = new TempChangeSummary();
            tempChangeRecordView.tempChangeRecordId = continentName;
            tempChangeRecordView.tempChangeRecordYear = continent.year;

            // Connect slots: this is done by creating five spans
            // with the "slot" attribute set to match the slot name. We then put these five
            // spans inside the custom element as if they were child nodes - this is where
            // the shadow DOM will pull the slot values from. 
            let yearSpan = document.createElement("span");
            yearSpan.slot = "year";
            yearSpan.innerText = continent.year;

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

            tempChangeRecordView.appendChild(yearSpan);
            tempChangeRecordView.appendChild(shareTempChangeSpan);
            tempChangeRecordView.appendChild(tempChangeCo2Span);
            tempChangeRecordView.appendChild(tempChangeN2OSpan);
            tempChangeRecordView.appendChild(tempChangeGhgSpan);
            tempChangeRecordView.appendChild(tempChangeCh4Span);

            this.#result.appendChild(tempChangeRecordView);
        }
    }
};

// Define the TempChangeRecordFinder class as a custom element
window.customElements.define('temp-change-record-finder', TempChangeRecordFinder);