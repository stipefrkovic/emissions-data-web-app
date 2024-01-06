export default class General{
    /** @type {integer} */
    GDP

    /** @type {integer} */
    population

    static fromJson(json){
        let general = new General();
        
        general.GDP = json.gdp;
        general.population = json.population;

        return general;
    }
}