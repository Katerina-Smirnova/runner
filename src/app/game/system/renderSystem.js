export default class RenderSystem {
    constructor(scene) {
        this.scene = scene;
        this.isInitialized = false;
    }

    update(entities) {
        for (const entity of entities) {
            const visual = entity.get("Visual");
            const position = entity.get("Position");
            const rotation = entity.get("Rotation");
            if (!this.isInitialized) {
                visual.mesh.position.set(position.x, position.y,position.z);
                this.isInitialized = true;
                return;
            }
            visual.mesh.position.x +=
                (position.x - visual.mesh.position.x) * 0.1;

            visual.mesh.position.y +=
                (position.y - visual.mesh.position.y) * 0.1;

            visual.mesh.position.z +=
                (position.z - visual.mesh.position.z) * 0.1;

            visual.mesh.rotation.x += rotation?.rotation ?? 0

            if (visual.mesh.parent === null) {
                this.scene.add(visual.mesh);
            }
        }
    }
}