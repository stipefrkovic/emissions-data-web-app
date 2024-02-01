/**
 * A class responsible for special record attributes.
 */
export default class Special {
    /** @type {string} */
    url;

    /**
     * Convert from JSON to Country instance.
     * @param {Record<string, any>} json JSON returned by API
     * @returns {Special}
     */
    static fromJson(json){
        let special = new Special();

        special.url = json.url;

        return special;
    }
}