import records from "../api/records.js";
import EnergySummary from "./energy-record-summary.js";

/**
 * This is a custom element representing an energy record finder as a whole.
 * It contains a small form where the user can enter a year, how to order by and the batches size
 * to search for, and will show all matching results with pagination. The user can pick any of 
 * the results, after which the element will emit a "energy-record-selected" event as 
 * defined above.
 */
export default class EnergyFinder extends HTMLElement {
    /** @type {HTMLInputElement} */ #yearSearch;
    /** @type {HTMLSelectElement} */ #orderBySearch;
    /** @type {HTMLSelectElement} */ #batchesSearch;
    /** @type {HTMLButtonElement} */ #find;
    /** @type {HTMLDivElement} */ #results;
    /** @type {HTMLButtonElement} */ #navNext;
    /** @type {HTMLButtonElement} */ #navPrev;

    /** @type {number} */ #batches = 10;
    /** @type {number} */ #limit = 100;
    /** @type {number} */ #ending = 1;
    /** @type {number} */ #endingOffset = 0;
    /** @type {number} */ #currentOffset = 1;
    /** @type {boolean} */ #hasResults = false;

    constructor() {
        super();

        // We start by finding the template and taking its contents.
        const template = document.getElementById("energy-record-finder");
        const templateContent = template.content;

        // Prepare shadow DOM and fill it with the template contents
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));

        // Find elements inside the templates and cache them for
        // future reference.
        this.#yearSearch = this.shadowRoot.getElementById("year");
        this.#orderBySearch = this.shadowRoot.getElementById("order-options");
        this.#batchesSearch = this.shadowRoot.getElementById("batches-options-val");
        this.#find = this.shadowRoot.getElementById("retrieve-energy");
        this.#results = this.shadowRoot.getElementById("energy-records");
        this.#navNext = this.shadowRoot.getElementById("page-next");
        this.#navPrev = this.shadowRoot.getElementById("page-prev");

        // Update the view to reflect the internal state.
        this.updateView();

        // Set up listeners to start search operation after every form
        // action.
        this.#find.addEventListener("click", async () => {
            this.#batches =
                this.#batchesSearch.options[this.#batchesSearch.selectedIndex].value;
            let energyResult;
            try {
                energyResult = await records.getEnergyRecord(
                    this.#yearSearch.value,
                    this.#orderBySearch.value,
                    parseInt(this.#batches),
                    1,
                    document.getElementById("content-type").value
                );
            } catch (e) {
                alert(e);
                return;
            }

            let numOfRecords = energyResult.length;
            this.#limit = numOfRecords;
            this.#currentOffset = 1;
            this.#ending = this.#limit % this.#batches;
            this.#endingOffset = Math.floor(this.#limit / this.#batches) + 1;

            await this.search();
        });

        this.#navNext.addEventListener("click", async () => {
            this.#currentOffset = parseInt(this.#currentOffset, 10) + 1;
            await this.search();
        });

        this.#navPrev.addEventListener("click", async () => {
            this.#currentOffset-- ;
            if (this.#currentOffset < 1) this.#currentOffset = 1;
            await this.search();
        });
    }

    /**
     * This function will make sure the view (DOM) state is consistent at all
     * times. It will take the internal state of the element and make sure the
     * DOM reflects this state. This is better than modifying the DOM from multiple
     * places, as that might become error-prone when dealing with more complicated
     * object lifecycles.
     */
    updateView() {
        this.#navNext.disabled = parseInt(this.#batches) != parseInt(this.#limit);
        this.#navPrev.disabled = !this.#hasResults || this.#currentOffset === 1;
    }

    /**
     * A function that extracts the values from the small input form and searches the
     * extracted information by calling the API. Once the necessary information has
     * been found, it is displayed on the web page using the EnergySummary object.
     */
    async search() {
        let year = this.#yearSearch.value;
        let orderby =
            this.#orderBySearch.options[this.#orderBySearch.selectedIndex].value;
        let limit;
        if (this.#currentOffset === this.#endingOffset) {
            limit = this.#ending;
        } else {
            limit = this.#batches;
        }

        let energyResult;
        try {
            energyResult = await records.getEnergyRecord(
                year,
                orderby,
                parseInt(this.#batchesSearch.options[this.#batchesSearch.selectedIndex].value),
                parseInt(this.#currentOffset),
                document.getElementById("content-type").value
            );
        } catch (e) {
            alert(e);
            return;
        }
        this.#limit = energyResult.length;

        // Clear old rendered results only after we received a new set of results, so
        // the front-end is always in a usable state.
        this.#results.innerHTML = "";
        this.#hasResults = false;

        // Build the new view: we instantiate an EnergySummary custom element for every
        // result, and create two spans that connect to the two slots in EnergySummary's
        // template.
        for (let energy of energyResult) {
            // Create a new summary instance and set its attributes (for later reference)
            let energyView = new EnergySummary();
            energyView.energyRecordYear = energy.year;

            // Connect slots: this is done by creating two spans 
            // with the "slot" attribute set to match the slot name. We then put these two
            // spans inside the custom element as if they were child nodes - this is where
            // the shadow DOM will pull the slot values from.
            let countrySpan = document.createElement("span");
            countrySpan.slot = "energy-country";
            countrySpan.innerText = energy.country;

            let energyPerCapitaSpan = document.createElement("span");
            energyPerCapitaSpan.slot = "energy-per-capita";
            energyPerCapitaSpan.innerText = energy.energyPerCapita != null ? energy.energyPerCapita : "No Info";;

            let energyPerGdp = document.createElement("span");
            energyPerGdp.slot = "energy-per-gdp";
            energyPerGdp.innerText = energy.energyPerGdp != null ? energy.energyPerGdp : "No Info";

            energyView.appendChild(countrySpan);
            energyView.appendChild(energyPerCapitaSpan);
            energyView.appendChild(energyPerGdp);

            this.#results.appendChild(energyView);
            this.#hasResults = true;
        }

        this.updateView();
    }
};

// Define the EnergyFinder class as a custom element
window.customElements.define('energy-record-finder', EnergyFinder);