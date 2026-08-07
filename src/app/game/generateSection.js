import {shuffle} from "@/app/game/shuffle";

export default class GenerateSection {
    constructor(lanes = 3) {
        this.lanes = lanes;
        this.currentLine = Math.floor(lanes / 2);
        this.minStraight = 2;
        this.maxStraight = 6;
        this.currentStraight = 0
        this.lastLine = -1
    }

    nextSection() {
        const section = new Array(this.lanes).fill(0);
        if (this.currentStraight === 0) {
            this.lastLine = this.currentLine;
            this.changeLane()
            this.currentStraight = shuffle.randomInt(this.minStraight, this.maxStraight);
            if(this.lastLine!==-1) section[this.lastLine] = 1;
        }
        this.currentStraight--
        section[this.currentLine] = 1;
        console.log(section);
        return section;
    }

    changeLane() {
        let direction = shuffle.randomDirection();
        if (this.currentLine === 0) {
            direction = 1
        }
        if (this.currentLine === this.lanes - 1) {
            direction = -1
        }
        this.currentLine += direction
    }

}