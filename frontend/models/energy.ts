export default class Energy{
    /** @type {number} */
    energy_per_capita;

    /** @type {number} */
    gdp_per_capita;

    static fromJson(json){
        let energy = new Energy();

        energy.energy_per_capita = json.energy_per_capita;
        energy.gdp_per_capita = json.gdp_per_capita;

        return energy;
    }
}