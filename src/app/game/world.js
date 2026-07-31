export default class World {
    entities = [];
    systems = [];

    addEntity(entity) {
        this.entities.push(entity);
    }

    addSystem(system) {
        this.systems.push(system);
    }

    removeEntities() {
        this.entities = this.entities.filter(entity => {
            if (!entity.destroy) {
                return true;
            }
            const visual = entity.get("Visual");
            if (visual) {
                if (visual.mesh.parent) {
                    visual.mesh.parent.remove(visual.mesh);
                }
                visual.mesh.traverse((child) => {

                    if (child.geometry) {
                        child.geometry.dispose();
                    }

                    if (child.material) {

                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => {
                                material.dispose();
                            });
                        } else {
                            child.material.dispose();
                        }
                    }
                });

            }
            return false;

        });
    }

    query(...components) {
        return this.entities.filter(entity =>
            components.every(name => entity.components.has(name))
        );
    }

    update(dt) {
        for (const system of this.systems) {
            if (Reflect.has(system, "update")) {
                system.update(this.entities, dt);
            }
        }
        this.removeEntities();
    }
}