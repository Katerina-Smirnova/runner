export default class PositionSystem {

    update(entities) {
        for (const entity of entities) {
            const movement = entity.get("Movement");
            const position = entity.get("Position");
            const rotation = entity.get("Rotation");
            position.z += rotation?.speed ?? 0;
            position.x += movement?.dx ?? 0;
            if (movement) {
                movement.dx = 0
            }
        }
    }
}