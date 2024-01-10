export default class Country {
    /** @type {string} */
    name;

    /** @type {number} */
    shareOfTempChangeFromGhg;

    /**
     * Convert from JSON to Country instance
     * @param {Record<string, any>} json JSON returned by API
     * @returns {Country}
     */

    static fromJson(json){
        let country = new Country();

        country.name = json.name;
        country.shareOfTempChangeFromGhg = json.shareOfTempChangeFromGhg;

        return country;
    }
}