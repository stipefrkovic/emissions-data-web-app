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

        energy.energyPerCapita = json.energyPerCapita;
        energy.energyPerGdp = json.energyPerGdp;

        return energy;
    }
}