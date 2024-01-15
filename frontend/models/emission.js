/**
 * A class responsible for emission record attributes.
 */
export default class Emission{
    /** @type {string} */
    id;
    /** @type {number} */
    year;
    /** @type {number} */
    co2;
    /** @type {number} */
    methane;
    /** @type {number} */
    nitrousOxide;
    /** @type {number} */
    totalGhg;

    /**
     * Convert from JSON to Emission instance
     * @param {Record<string, any>} json JSON returned by API
     * @returns {Emission}
     */
    static fromJson(json){
        let emission = new Emission();

        emission.id = json.id;
        emission.year = json.year;
        emission.co2 = json.co2;
        emission.methane = json.methane;
        emission.nitrousOxide = json.nitrousOxide;
        emission.totalGhg = json.totalGhg;

        return emission;
    }
}