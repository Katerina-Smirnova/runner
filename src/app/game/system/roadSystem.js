import {gameSetting} from "@/app/game/gameSetting";

export default class RoadSystem {
    update(entities) {
        for (let entity of entities) {
            const visual = entity.get("Visual");
            const road = entity.get("Road");
            if (road) {
                const segments = road.sections
                if (visual.mesh.position.z > (-segments[0].position.z + gameSetting.road.size.height)) {
                    segments[0].position.z = segments[segments.length - 1].position.z - gameSetting.road.size.height;
                    const newSegment = segments.shift()
                    segments.push(newSegment)
                }
            }
        }
    }
}