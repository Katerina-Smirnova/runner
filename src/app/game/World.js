export default class World {
    entities = [];
    systems = [];

    addEntity(entity) {
        this.entities.push(entity);
    }
    addSystem(system) {
        this.systems.push(system);
    }


    query(...components) {
        return this.entities.filter(entity =>
            components.every(name => entity.components.has(name))
        );
    }

    update(dt) {
        for (const system of this.systems) {
            if(Reflect.has(system, "update")){
                system.update(this.entities, dt);
            }


        }
    }
}