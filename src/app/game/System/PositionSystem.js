
export default class PositionSystem {

    update(entities) {
        for(const entity of entities) {
            const movement = entity.get("Movement");
            const position = entity.get("Position");

            if(movement){
                position.x += movement.dx
                position.z += movement.dz
                movement.dx=0
                movement.dz=0
            }

        }
    }
}