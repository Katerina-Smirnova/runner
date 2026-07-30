
export default class PositionSystem {

    update(entities) {
        for(const entity of entities) {
            const movement = entity.get("Movement");
            const position = entity.get("Position");

            position.x += movement?.dx ?? 0;
            if(movement){
                movement.dx =0
            }


        }
    }
}