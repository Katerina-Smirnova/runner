export default class RenderSystem {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
    }

    update(entities) {
        for (const entity of entities) {
            const visual = entity.get("Visual");
            const position = entity.get("Position");
            const rotation = entity.get("Rotation");
            const offset = entity.get("Offset");
            const movingForward = entity.get("MovingForward");

            if (movingForward) {
                position.y += movingForward.y;
                position.z += movingForward.z;
                visual.mesh.scale.multiplyScalar(1.003);
            }

            visual.mesh.position.x +=
                (position.x - visual.mesh.position.x) * 0.1;

            visual.mesh.position.y +=
                (position.y - visual.mesh.position.y) * 0.1;

            visual.mesh.position.z +=
                (position.z - visual.mesh.position.z) * 0.1;

            visual.mesh.rotation.x += rotation?.x ?? 0
            if (offset) {
                visual.mesh.material.map.offset.y += offset?.y ?? 0;
            }
            if(position.y<20){
                this.world.deleteEntity(entity)
            }
            if (visual.mesh.parent === null) {
                this.scene.add(visual.mesh);
            }


        }
    }
}