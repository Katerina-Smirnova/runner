export default class GenerateSection {
    constructor(lanes = 3, obstacleChance = 0.5) {
        this.lanes = lanes;
        this.obstacleChance = obstacleChance;
        this.safeLane = Math.floor(lanes / 2);
    }

    nextSection() {
        const random = Math.round(Math.random());
        if (random === 0 && this.safeLane > 0) {
            this.safeLane--;
        } else if (random === 1 && this.safeLane < this.lanes - 1) {
            this.safeLane++;
        }
        const section = new Array(this.lanes).fill(1);
        for (let lane = 0; lane < this.lanes; lane++) {
            if (lane === this.safeLane)
                continue;
            if (Math.random() < this.obstacleChance) {
                section[lane] = 0;
            }
        }
        return section;
    }
}