export default class RenderSystem {
    constructor(scene) {
        this.scene = scene;
    }

    update(entities) {
        for (const entity of entities) {
            const visual = entity.get("Visual");
            const position = entity.get("Position");

            if (!visual || !position) continue;

            visual.mesh.position.set(
                position.x,
                position.y,
                position.z
            );

            if (visual.mesh.parent === null) {
                this.scene.add(visual.mesh);
            }
        }
    }
}