import gsap from "gsap";
import {gameSetting} from "@/app/game/gameSetting";

export default class PositionSystem {

    update(entities) {
        for (const entity of entities) {
            const movement = entity.get("Movement");
            const position = entity.get("Position");
            const rotation = entity.get("Rotation");
            position.z += rotation?.speed ?? 0;
            position.x += movement?.dx ?? 0;
            if (movement) {
                position.y += movement.dy;
                movement.dy  -= 0.001
                if (position.y >= movement.startY + movement.jumpHeight) {
                    movement.dy = -Math.abs(movement.dy);
                    // movement.jumpHeight-=1
                } else if (movement.dy < 0 && position.y <= 0.25) {
                    console.log('down')
                    position.y = movement.startY;
                    movement.dy = 0;
                }
            }

            if (movement) {
                movement.dx = 0

            }
        }
    }
}