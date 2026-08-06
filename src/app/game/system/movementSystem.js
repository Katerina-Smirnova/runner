import {gameSetting} from "@/app/game/gameSetting";

export default class MovementSystem {
    update(entities) {
        for (const entity of entities) {
            const movement = entity.get("Movement");
            const input = entity.get("EventInput");
            const position = entity.get("Position");
            if (!movement) continue;
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