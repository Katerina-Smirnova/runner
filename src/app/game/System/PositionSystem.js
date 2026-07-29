
export default class PositionSystem {

    update(entities) {
        for(const entity of entities) {
            const movement = entity.get("Movement");
            const position = entity.get("Position");

            if(movement){
                position.x += movement.dx
                movement.dx=0
            }

        }
    }
}