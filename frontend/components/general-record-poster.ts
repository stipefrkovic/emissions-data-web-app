import records from "../api/records.ts";
// ApiGeneralSummary maybe needed
// GeneralSummary maybe needed
import GeneralSelectedEvent from "./general-record-selected-event.ts";

/**
 * A custom element representing a general record poster.
 * It contains a small form where the user can enter a 
 * country name, year, GDP and population.
 * Summary information of the general record will be posted and displayed.
 */
export default class RecordPoster extends HTMLElement {
    /** @type {HTMLInputElement} */ #country;
    /** @type {HTMLInputElement} */ #year;
    /** @type {HTMLInputElement} */ #gdp;
    /** @type {HTMLInputElement} */ #population;
    /** @type {HTMLButtonElement} */ #post;
    /** @type {HTMLDivElement} */ #result;

    /**
     * Constructs an instance of this class.
     * It initializes the fields by calling the corresponding html elements.
     */
    constructor() {
        // Always call the parent constructor!
        super();

        // We start by finding the template and taking its contents.
        const template: HTMLElement | null = document.getElementById("general-record-poster");
        if (template instanceof HTMLMetaElement) {
            const templateContent = template.content;

            // Prepare shadow DOM and fill it with the template contents
            this.attachShadow({ mode: "open" });
            if (this.shadowRoot != null) {
                this.shadowRoot.appendChild((templateContent as any).cloneNode(true));

                // Find elements inside the templates and cache them for
                // future reference.
                this.#country = this.shadowRoot.getElementById("country");
                this.#year = this.shadowRoot.getElementById("year");
                this.#gdp = this.shadowRoot.getElementById("gdp");
                this.#population = this.shadowRoot.getElementById("population");
                this.#post = this.shadowRoot.getElementById("post");
                this.#result = this.shadowRoot.getElementById("records");
            } else {
                alert("Shadow DOM ain't working (null error)!");
            }
        } else {
            alert("Template is not working (null).");
        }

        this.#post.addEventListener("click", async () => {
            await this.search();
        });
    }


    async search() {
        let countryName = this.#country.value;
        let year = this.#year.value;
        let gdp = this.#gdp.value;
        let population = this.#population.value;

        /** @type {} */
        let countryResult;
        try {
            countryResult = await records.postGeneralRecord(countryName, year, gdp, population);
        } catch (e) {
            alert(e);
            return;
        }

        this.#result.innerHTML = "";

        for (let country of countryResult) {
            let recordView = new RecordSummary();
            recordView.countryId = country.id;

            let countrySpan = document.createElement("span");
            countrySpan.slot = "name";
            countrySpan.innerText = country.name;

            recordView.appendChild(countrySpan);

            recordView.addEventListener("click", () => {
                this.dispatchEvent(new GeneralSelectedEvent(recordView.songId));
            });

            this.#result.appendChild(recordView);
        }
    }
}

window.customElements.define("general-record-poster", RecordPoster);
