import GenerateSection from "@/app/game/generateSection";

export default class SafeWaySystem{
    constructor(world) {
        this.world = world;
        this.generate =  new GenerateSection()
        this.create()
    }
    create() {
        for (const entity of this.world.entities) {
            const wayComponent = entity.get("Way");
            if(wayComponent){
                for(let i = 0; i <10; i++){
                    wayComponent.way.push(this.generate.nextSection())
                }console.log(wayComponent.way)
            }

        }
    }
    update(entities){
        for (const entity of entities) {
            const wayComponent = entity.get("Way");
            const visual = entity.get("Visual")
            if(wayComponent){
                // console.log(visual.mesh.position.z % 5)
                if(visual.mesh.position.z % 5 === 0){
                    console.log(visual.mesh.position.z)
                    wayComponent.way.shift()
                    wayComponent.way.push(this.generate.nextSection())
                    console.log(wayComponent.way)
                }

            }
        }
    }

}