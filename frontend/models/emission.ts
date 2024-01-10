export default class Emission{
    id!: string;
    year!: number;
    co2?: number;
    methane?: number;
    nitrousOxide?: number;
    totalGhg?: number;

    static fromJson(json: Record<string, any>){
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