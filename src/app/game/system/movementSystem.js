import {gameSetting} from "@/app/game/gameSetting";

export default class MovementSystem {
    constructor(world) {
        this.world = world;
    }
    update(entities) {
        const objects = entities.filter(entity =>
            entity.get("Movement") &&
            entity.get("EventInput")
        );
        for (const entity of objects) {
            const movement = entity.get("Movement");
            const input = entity.get("EventInput");
            const position = entity.get("Position");
            if (input.direction === 'right' && position.x <= gameSetting.line.center) {
                movement.dx = 1;
                input.direction = null;
            } else if (input.direction === 'left' && position.x >= gameSetting.line.center) {
                movement.dx = -1;
                input.direction = null;
            }else if (input.direction === 'up') {
                movement.jumpRequested=true;
                input.direction = null;
            }
        }
    }
}