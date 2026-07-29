export default class RenderSystem {
    constructor(scene) {
        this.scene = scene;
    }

    update(entities) {
        for (const entity of entities) {
            const visual = entity.get("Visual");
            const position = entity.get("Position");

            // if (!visual || !position) continue;

            visual.mesh.position.x +=
                (position.x - visual.mesh.position.x) * 0.15;

            visual.mesh.position.y +=
                (position.y - visual.mesh.position.y) * 0.15;

            visual.mesh.position.z +=
                (position.z - visual.mesh.position.z) * 0.15;

            if (visual.mesh.parent === null) {
                this.scene.add(visual.mesh);
            }
        }
    }
}