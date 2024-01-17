/**
 * A class responsible for country record attributes.
 */
export default class Country {
    /** @type {string} */
    name;

    /** @type {number} */
    shareOfTempChangeFromGhg;

    /**
     * Convert from JSON to Country instance.
     * @param {Record<string, any>} json JSON returned by API
     * @returns {Country}
     */

    static fromJson(json){
        let country = new Country();

        country.name = json.country;
        country.shareOfTempChangeFromGhg = json.share_of_temperature_change_from_ghg;

        return country;
    }
}