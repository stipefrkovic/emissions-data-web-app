/**
 * A custom element representing an energy record finder.
 * It contains a small form where the user can enter a song name and year, as well as limiting the results.
 * Summary information of the songs specified by this name will be fetched and displayed.
 */
export default class EnergyRecordFinder extends HTMLElement {
    /** @type {HTMLInputElement} */ #yearSearch;
    /** @type {HTMLSelectElement} */ #orderBySearch;
    /** @type {HTMLSelectElement} */ #batchesSearch;
    /** @type {HTMLButtonElement} */ #find;
    /** @type {HTMLDivElement} */ #results;
    /** @type {HTMLButtonElement} */ #navNext;
    /** @type {HTMLButtonElement} */ #navPrev;

    /** @type {number} */ #batches = 10;
    /** @type {number} */ #ending = 1;
    /** @type {number} */ #endingOffset = 0;
    /** @type {number} */ #currentOffset = 0;
    /** @type {boolean} */ #hasResults = false;

    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html elements.
     */
    constructor() {
        // Always call the parent constructor!
        super();

        // We start by finding the template and taking its contents.
        const template: HTMLElement | null = document.getElementById("energy-record-finder");
        if (template instanceof HTMLMetaElement) {
            const templateContent = template.content;

            // Prepare shadow DOM and fill it with the template contents
            this.attachShadow({ mode: "open" });
            if (this.shadowRoot != null) {
                this.shadowRoot.appendChild((templateContent as any).cloneNode(true));

                // Find elements inside the templates and cache them for
                // future reference.
                this.#yearSearch = this.shadowRoot.getElementById("year");
                this.#orderBySearch = this.shadowRoot.getElementById("order-by");
                this.#batchesSearch = this.shadowRoot.getElementById("batches");
                this.#find = this.shadowRoot.getElementById("find");
                this.#results = this.shadowRoot.getElementById("energy-records");
                this.#navNext = this.shadowRoot.getElementById("page-next");
                this.#navPrev = this.shadowRoot.getElementById("page-prev");
            } else {
                alert("Shadow DOM ain't working (null error)!");
            }
        } else {
            alert("Template is not working (null).");
        }

        this.updateView();

        this.#find.addEventListener("click", async () => {
            this.#batches =
                this.#batchesSearch.options[this.#batchesSearch.selectedIndex].value;

            /** @type {ApiSongSummary[]} */
            let energyResult;
            try {
                energyResult = await records.getEnergyRecords(
                    this.#yearSearch.value,
                    0,
                    this.#orderBySearch.value
                );
            } catch (e) {
                alert(e);
                return;
            }

            let numOfRecords = energyResult.length;
            this.#currentOffset = 0;
            //this.#endingOffset = Math.floor(limit / this.#batches) * this.#batches;

            await this.search();
        });

        this.#navNext.addEventListener("click", async () => {
            this.#currentOffset =
                parseInt(this.#batches, 10) + parseInt(this.#currentOffset, 10);
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

        /** @type {} */
        let energyResult;
        try {
            energyResult = await records.getEnergyRecords(
                year,
                this.#currentOffset,
                orderby
            );
        } catch (e) {
            alert(e);
            return;
        }

        this.#results.innerHTML = "";
        this.#hasResults = false;

        for (let energy of energyResult) {
            let energyView = new RecordSummary();
            energyView.energyId = energy.id;

            let nameSpan = document.createElement("span");
            nameSpan.slot = "name";
            nameSpan.innerText = energy.name;

            energyView.appendChild(nameSpan);

            energyView.addEventListener("click", () => {
                this.dispatchEvent(new EnergyRecordSelectedEvent(energyView.songId));
            });

            this.#results.appendChild(energyView);
            this.#hasResults = true;
        }

        this.updateView();
    }
}

window.customElements.define("energy-record-finder", EnergyRecordFinder);
