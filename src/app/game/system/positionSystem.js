
export default class PositionSystem {

    update(entities) {
        for(const entity of entities) {
            const movement = entity.get("Movement");
            const position = entity.get("Position");
            const road = entity.get("Road");
            position.z += road?.speed?? 0;

            position.x += movement?.dx ?? 0;
            if(movement){
                movement.dx =0
            }
        }
    }
}