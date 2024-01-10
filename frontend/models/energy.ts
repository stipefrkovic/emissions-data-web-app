export default class Energy{
    energyPerCapita?: number;
    energyPerGdp?: number;

    static fromJson(json: Record<string, any>){
        let energy = new Energy();

        energy.energyPerCapita = json.energyPerCapita;
        energy.energyPerGdp = json.energyPerGdp;

        return energy;
    }
}