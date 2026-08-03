export default class RenderSystem {
    constructor(scene) {
        this.scene = scene;
    }

    update(entities) {
        for (const entity of entities) {
            const visual = entity.get("Visual");
            const position = entity.get("Position");
            const rotation = entity.get("Rotation");

            visual.mesh.position.x +=
                (position.x - visual.mesh.position.x) * 0.1;

            visual.mesh.position.y +=
                (position.y - visual.mesh.position.y) * 0.1;

            visual.mesh.position.z +=
                (position.z - visual.mesh.position.z) * 0.1;

            visual.mesh.rotation.x += rotation?.x ?? 0

            if (visual.mesh.parent === null) {
                this.scene.add(visual.mesh);
            }
        }
    }
}