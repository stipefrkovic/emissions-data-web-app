/**
 * A class responsible for general record attributes.
 */
export default class General{
    /** @type {string} */
    id;
    /** @type {number} */
    year;
    /** @type {number} */
    gdp;
    /** @type {number} */
    population;

    /**
     * Convert from JSON to General instance
     * @param {Record<string, any>} json JSON returned by API
     * @returns {General}
     */
    static fromJson(json){
        let general = new General();
        
        general.id = json.country;
        general.year = json.year;
        general.gdp = json.gdp;
        general.population = json.population;

        return general;
    }
}