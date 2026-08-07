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
    getEntity(component) {
        return this.world.queryEntity(component);
    }

    create() {
        for (const entity of this.getEntity("Road")) {
            const road = entity.get("Road");
            for (let i = 0; i < 20; i++) {
                const newSection = {path: this.generate.nextSection(), positionZ: this.z, positionY: 0.25, entities: []}
                road.addSafeWay(newSection);
                this.z -= this.distance;
            }
        }
    }

    update(entities) {
        const ball = entities.find(e => e.getName() === "ball");
        if (!ball)
            return;
        const position = ball.get("Position");
        const roadEntity = entities.find(entity => entity !== ball && entity.get("Road"))
        if (!roadEntity) return;
        const road = roadEntity.get("Road");

        if (position.z < road.safeWay[0].positionZ - (this.distance * 2)) {
            road.safeWay[0].entities.forEach(entity => {
                this.world.removeEntities(entity)
            })
            road.removeSafeWay(road.safeWay[0])
            const newSection = {path: this.generate.nextSection(), positionZ: this.z, positionY: 0.25, entities: []}
            road.addSafeWay(newSection);
            this.z -= this.distance
        }
    }
}