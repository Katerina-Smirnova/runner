import GenerateSection from "@/app/game/generateSection";
import {gameSetting} from "@/app/game/gameSetting";

export default class JetpackFlightSystem {
    constructor(world) {
        this.generate = new GenerateSection()
        this.z = gameSetting.safeWay.startZ
        this.distance = gameSetting.safeWay.distance
        this.created = false
        this.world = world;
    }

    create(entity) {
        this.z = entity.startZ - 8
        const y = entity.startY + entity.height
        for (let i = 0; i < 10; i++) {
            const newSection = {path: this.generate.nextSection(), positionZ: this.z, positionY: y, entities: []}
            entity.addWay(newSection);
            this.z -= this.distance;
        }
    }
    getEntity(component) {
        return this.world.queryEntity(component);
    }

    update() {
        for (const entity of this.getEntity("Jetpack")) {
            const jetpack = entity.get("Jetpack");
            if (!jetpack.isActive) continue;
            const position = entity.get("Position");
            const player = entity.get("Player");
            player.immunity = true
            if (position.z === jetpack.startZ && !this.created) {
                this.created = true;
                this.create(jetpack)
                return
            }
            if (position.z <= jetpack.endZ) {
                position.y += (jetpack.startY - position.y) * 0.1;
                position.z -= 0.1
                player.speed = -0.05;
                this.created = false
                if (Math.abs(position.y - jetpack.startY) < 0.01) {
                    position.y = jetpack.startY;
                    jetpack.isActive = false;
                    player.speed = -0.1;
                    player.immunity = false
                }
            } else {
                position.y += (jetpack.startY + jetpack.height - position.y) * 0.1;
                player.speed = -0.13;
            }
            if (position.z < jetpack.way[0]?.positionZ - (this.distance * 2)) {
                jetpack.way[0].entities.forEach(entity => {
                    this.world.removeEntities(entity)
                })
                jetpack.removeWay(jetpack.way[0])
            }
        }
    }
}