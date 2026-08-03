import Shuffle from "@/app/game/shuffle";

export default class GenerateSection {
    constructor(lanes = 3) {
        this.lanes = lanes;
        this.currentLine = Math.floor(lanes / 2);
        this.minStraight = 2;
        this.maxStraight = 6;
        this.shuffle = new Shuffle();
        this.currentStraight = 0
    }

    nextSection() {
        if (this.currentStraight === 0) {
            this.changeLane()
            this.currentStraight = this.shuffle.randomInt(this.minStraight, this.maxStraight);
        }
        this.currentStraight--
        const section = new Array(this.lanes).fill(0);
        section[this.currentLine] = 1;
        return section;
    }

    changeLane() {
        let direction = this.shuffle.randomDirection();
        if (this.currentLine === 0) {
            direction = 1
        }
        if (this.currentLine === this.lanes - 1) {
            direction = -1
        }
        this.currentLine += direction
    }

}