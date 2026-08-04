export default class World {
    entities = [];
    systems = [];
    countCoins = 0;

    addEntity(entity) {
        this.entities.push(entity);
    }

    addSystem(system) {
        this.systems.push(system);
    }

    removeEntities(entity) {
        this.entities = this.entities.filter(e => {
            if (e !== entity) {
                return true;
            }

            const visual = e.get("Visual");

            if (visual) {
                const mesh = visual.mesh;

                if (mesh.parent) {
                    mesh.parent.remove(mesh);
                }

                mesh.traverse((child) => {
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

    update() {
        for (const system of this.systems) {
            if (Reflect.has(system, "update")) {
                system.update(this.entities);
            }
        }
        this.removeEntities();
    }
    stopPlay(){
        this.entities = []
        this.systems = []
        this.countCoins = 0
    }
}