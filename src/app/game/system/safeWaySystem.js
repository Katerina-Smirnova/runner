import GenerateSection from "@/app/game/generateSection";
import {gameSetting} from "@/app/game/gameSetting";
import {Group} from "three";
import Position from "@/app/game/components/position";

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
            const visual = entity.get("Visual")
            if (!road) continue;
            for (let i = 0; i < 10; i++) {
                const group = this.createGroup(this.z)
                const newSection = {path: this.generate.nextSection(), positionZ: this.z, objects:group,entities:[]}
                road.addSafeWay(newSection);
                visual.mesh.add(group)
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
                road.safeWay[0].entities.forEach(entity => {this.world.removeEntities(entity)})
                visual.mesh.remove(road.safeWay[0].objects)
                road.removeSafeWay(road.safeWay[0])
                const group = this.createGroup(this.z)
                const newSection = {path: this.generate.nextSection(), positionZ: this.z, objects:group, entities:[]}
                road.addSafeWay(newSection);
                visual.mesh.add(group)
                this.z -= this.distance
            }
        }
    }
    createGroup(z){
        const group = new Group();
        const position = new Position(0, 0.2, z);
        group.position.set(
            position.x,
            position.y,
            position.z,
        );

        return group;
    }
}