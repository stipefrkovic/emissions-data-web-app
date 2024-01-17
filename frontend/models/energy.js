/**
 * A class responsible for energy record attributes.
 */
export default class Energy{
    /** @type {number} */
    energyPerCapita;

    /** @type {number} */
    energyPerGdp;

    /**
     * Convert from JSON to Energy instance
     * @param {Record<string, any>} json JSON returned by API
     * @returns {Energy}
     */
    static fromJson(json){
        let energy = new Energy();
        energy.country = json.country
        energy.energyPerCapita = json.energy_per_capita;
        energy.energyPerGdp = json.energy_per_gdp;

        return energy;
    }
}