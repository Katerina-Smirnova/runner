import GenerateSection from "@/app/game/generateSection";

export default class SafeWaySystem {
    constructor(world) {
        this.world = world;
        this.generate = new GenerateSection()
        this.z = -10
        this.distance = 5
        this.create()
    }

    create() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            if (!road) continue;
            for (let i = 0; i < 10; i++) {
                road.safeWay.push({path: this.generate.nextSection(), positionZ: this.z})
                this.z -= this.distance;
            }
            console.log(road.safeWay)
        }
    }

    update(entities) {
        for (const entity of entities) {
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if(road){
                if (visual.mesh.position.z > -road.safeWay[0].positionZ+ this.distance*2) {
                    road.safeWay.push({path: this.generate.nextSection(), positionZ: this.z})
                    this.z -= this.distance
                    road.isChanged=true
                }
            }
        }
    }

}