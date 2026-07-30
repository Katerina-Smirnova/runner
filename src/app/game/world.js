export default class World {
    entities = [];
    systems = [];

    addEntity(entity) {
        this.entities.push(entity);
    }
    addSystem(system) {
        this.systems.push(system);
    }
    deleteEntity(entity) {
        console.log('delete')
        const visual = entity.get("Visual");
        visual.mesh.geometry.dispose();
        visual.mesh.material.dispose();
        this.entities.filter(item => {item===entity})

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