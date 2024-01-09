export default class General{
    id!: string;
    year!: number;
    gdp?: number;
    population?: number;

    static fromJson(json: Record<string, any>){
        let general = new General();
        
        general.id = json.id;
        general.year = json.year;
        general.gdp = json.gdp;
        general.population = json.population;

        return general;
    }
}