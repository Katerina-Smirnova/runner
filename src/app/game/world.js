import EntityIndex from "@/app/game/entityIndex";

export default class World {
    constructor() {
        this.entities = [];
        this.systems = [];
        this.countCoins = 0;
        this.isPause = false;
        this.indexer = new EntityIndex()
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.indexer.add(entity);
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

    queryEntity(components) {
        return this.indexer.getEntity(components)
    }
    queryComponent(entity) {
        return this.indexer.getComponent(entity)
    }
    queryEntitiesSeveral(...components) {
        return this.indexer.getEntitiesSeveral(...components)
    }

    update() {
        if (this.isPause) return
        for (const system of this.systems) {
            if (Reflect.has(system, "update")) {
                system.update(this.entities);
            }
        }
        this.removeEntities();
    }

    stopPlay() {
        this.entities = []
        this.systems = []
        this.countCoins = 0
    }
}