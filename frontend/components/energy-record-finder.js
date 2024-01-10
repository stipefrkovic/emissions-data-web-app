import records from "../api/records.js";
import EnergySummary from "./energy-record-summary.js";

// This is a custom Event to represent a movie being selected,
// carrying a movieId field with it to represent which movie is
// being selected. This is used in the MovieFinder element, to
// inform the rest of the application that the user selected a movie.
export class EnergyRecordSelectedEvent extends Event {
    /** @type {number} */
    energyId;

    /**
     * @param {number} energyId 
     */
    constructor(energyId) {
        // We call the parent constructor with a string representing
        // the name of this event. This is what we listen to.
        super("energy-record-selected");

        this.energyId = energyId;
    }
}

// This is a custom element representing a movie finder as a whole.
// It contains a small form where the user can enter a title and year
// to search for, and will show all matching results with pagination.
// The user can pick any of the results, after which the element will
// emit a "movie-selected" event as defined above.
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
    /** @type {number} */ #currentOffset = 0;
    /** @type {boolean} */ #hasResults = false;

    constructor() {
        // Always call the parent constructor!
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
        this.#orderBySearch = this.shadowRoot.getElementById("order-by");
        this.#batchesSearch = this.shadowRoot.getElementById("batches-search");
        this.#find = this.shadowRoot.getElementById("find");
        this.#results = this.shadowRoot.getElementById("records");
        this.#navNext = this.shadowRoot.getElementById("page-next");
        this.#navPrev = this.shadowRoot.getElementById("page-prev");

        this.updateView();

        this.#find.addEventListener("click", async () => {
            this.#batches =
                this.#batchesSearch.options[this.#batchesSearch.selectedIndex].value;
            let energyResult;
            try {
                energyResult = await records.getEnergyRecord(
                    this.#yearSearch.value,
                    this.#orderBySearch.value,
                    this.#batchesSearch,
                    1
                );
            } catch (e) {
                alert(e);
                return;
            }

            let numOfRecords = energyResult.length;
            this.#limit = numOfRecords;
            this.#currentOffset = 0;
            this.#ending = this.#limit % this.#batches;
            this.#endingOffset = Math.floor(this.#limit / this.#batches) * this.#batches;

            await this.search();
        });

        this.#navNext.addEventListener("click", async () => {
            // maybe do parseInt
            this.#currentOffset = this.#batches + this.#currentOffset;
            await this.search();
        });

        this.#navPrev.addEventListener("click", async () => {
            this.#currentOffset -= this.#batches;
            if (this.#currentOffset < 0) this.#currentOffset = 0;
            await this.search();
        });
    }

    /**
     * Updates the state of the Next and Prev buttons.
     */
    updateView() {
        this.#navNext.disabled =
            this.#ending % this.#batches === 0
                ? this.#currentOffset === this.#endingOffset - this.#batches
                : this.#currentOffset === this.#endingOffset;
        this.#navPrev.disabled = !this.#hasResults || this.#currentOffset === 0;
    }

    // TODO: not sure whether this works
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
                this.#batchesSearch,
                this.#currentOffset
            );
        } catch (e) {
            alert(e);
            return;
        }

        this.#results.innerHTML = "";
        this.#hasResults = false;

        for (let energy of energyResult) {
            let energyView = new EnergySummary();
            energyView.energyRecordYear = energy.year;

            let energyPerCapitaSpan = document.createElement("span");
            energyPerCapitaSpan.slot = "energy-per-capita";
            energyPerCapitaSpan.innerText = energy.energyPerCapita;

            let gdpPerCapita = document.createElement("span");
            gdpPerCapita.slot = "gdp-per-capita";
            gdpPerCapita.innerText = energy.gdpPerCapita;

            energyView.appendChild(energyPerCapitaSpan);
            energyView.appendChild(gdpPerCapita);

            energyView.addEventListener("click", () => {
                this.dispatchEvent(new EnergyRecordSelectedEvent(energyView.energyRecordYear));
            });

            this.#results.appendChild(energyView);
            this.#hasResults = true;
        }

        this.updateView();
    }
};

// Define the MovieFinder class as a custom element
window.customElements.define('energy-record-finder', EnergyFinder);