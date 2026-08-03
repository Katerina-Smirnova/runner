import GenerateSection from "@/app/game/generateSection";
import {gameSetting} from "@/app/game/gameSetting";

export default class SafeWaySystem {
    constructor(world) {
        this.world = world;
        this.generate = new GenerateSection()
        this.z = gameSetting.safeWay.startZ
        this.distance = gameSetting.safeWay.distance
        this.create()
    }

    create() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            if (!road) continue;
            for (let i = 0; i < 10; i++) {
                const newSection = {path: this.generate.nextSection(), positionZ: this.z}
                road.addSafeWay(newSection);
                this.z -= this.distance;
            }
        }
    }

    update(entities) {
        for (const entity of entities) {
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if (!road) continue;
            if (visual.mesh.position.z > -road.safeWay[0].positionZ + this.distance * 2) {
                const newSection = {path: this.generate.nextSection(), positionZ: this.z}
                road.addSafeWay(newSection);
                this.z -= this.distance
            }
        }
    }
}