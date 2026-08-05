import {gameSetting} from "@/app/game/gameSetting";

export default class RoadSystem {
    update(entities) {
        const ball = entities.find(e => e.getName() === "ball");
        if (!ball)
            return;
        const position = ball.get("Position");
        const roadEntity = entities.find(entity => entity !== ball && entity.get("Road"));
        if (!roadEntity) return;
        const road= roadEntity.get("Road");
        const segments = road.sections
        if (position.z < (segments[0].position.z - gameSetting.road.size.height)) {
            segments[0].position.z = segments[segments.length - 1].position.z - gameSetting.road.size.height;
            const newSegment = segments.shift()
            segments.push(newSegment)
        }
    }
}