import {Vector3} from "three";
import gsap from "gsap";


export default class CollisionSystem {
    constructor(world) {
        this.world = world;
    }

    update(entities) {
        const ball = entities.find(e => e.getName() === "ball");
        if (!ball)
            return;

        const objects = entities.filter(entity => entity !== ball &&
            entity.get("Collider") &&
            entity.get("Position")
        );

        for (const entity of objects) {
            if (!this.checkCollision(ball, entity))
                continue;
            this.onCollision(entity);
        }

    }

    checkCollision(firstEntity, secondEntity) {
        const firstPos = this.getWorldPosition(firstEntity);
        const secondPos = this.getWorldPosition(secondEntity);
        const firstCol = firstEntity.get("Collider");
        const secondCol = secondEntity.get("Collider");

        return (
            Math.abs(firstPos.x - secondPos.x) <
            (firstCol.width + secondCol.width) / 2 &&

            Math.abs(firstPos.y - secondPos.y) <
            (firstCol.height + secondCol.height) / 2 &&

            Math.abs(firstPos.z - secondPos.z) <
            (firstCol.depth + secondCol.depth) / 2
        );
    }
    getWorldPosition(entity) {
        const pos = entity.get("Position");
        if (!pos) return null;
        const parentGroup = entity.get("ParentGroup");
        if (parentGroup) {
            const groupWorldPos = new Vector3();
            parentGroup.getWorldPosition(groupWorldPos);
            return {
                x: pos.x + groupWorldPos.x,
                y: pos.y + groupWorldPos.y,
                z: pos.z + groupWorldPos.z
            };
        }
        return pos;
    }

    onCollision(object) {
        const mesh = object.get("Visual").mesh;
        switch (object.name) {
            case "Obstacle":
                this.world.stopPlay()
                break;
            case "Coin":
                this.world.countCoins++;
                gsap.to(mesh.position, {
                    y: mesh.position.y + 2,
                    z: mesh.position.z - 1,
                    duration: 0.5,
                    ease: "power2.out",
                });
                break;
        }
    }
}