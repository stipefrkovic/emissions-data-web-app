export default class Emission{
    /** @type {number} */
    co2;

    /** @type {number} */
    methane;

    /** @type {number} */
    nitrous_oxide;

    /** @type {number} */
    total_ghg;

    static fromJson(json){
        let emission = new Emission();

        emission.co2 = json.co2;
        emission.methane = json.methane;
        emission.nitrous_oxide = json.nitrous_oxide;
        emission.total_ghg = json.total_ghg;

        return emission;
    }
}