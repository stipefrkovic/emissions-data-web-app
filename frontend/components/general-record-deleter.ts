

/**
 * A custom element representing a general record deleter.
 * It contains a small form where the user can enter a country id.
 */
export default class RecordDeleter extends HTMLElement {
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
        const template: HTMLElement | null = document.getElementById("general-record-deleter");
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
                this.#delete = this.shadowRoot.getElementById("delete");
                this.#result = this.shadowRoot.getElementById("records");
            } else {
                alert("Shadow DOM ain't working (null error)!");
            }
        } else {
            alert("Template is not working (null).");
        }

        //Search when the button is clicked
        this.#delete.addEventListener("click", async () => {
            await this.search();
        });
    }

    async search() {
        let country = this.#countrySearch.value;
        let year = this.#yearSearch.value;

        /** @type {} */
        let countryResult;
        try {
            countryResult = await records.deleteArtistSongs(country, year);
        } catch (e) {
            alert(e);
            return;
        }

        //Clear view
        this.#result.innerHTML = "";

        //Build new view
        for (let country of countryResult) {
            let recordView = new RecordSummary();
            recordView.countryId = country.id;

            let countrySpan = document.createElement("span");
            countrySpan.slot = "name";
            countrySpan.innerText = country.name;

            recordView.appendChild(countrySpan);

            recordView.addEventListener("click", () => {
                this.dispatchEvent(new RecordSelectedEvent(recordView.countryId));
            });

            this.#result.appendChild(recordView);
        }
    }
}

window.customElements.define("general-record-deleter", RecordDeleter);