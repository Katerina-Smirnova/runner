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
        // const secondPos = secondEntity.get("Position");
        const visual = firstEntity.get("Visual")
        const firstPos = new Vector3();
        visual.mesh.getWorldPosition(firstPos);

        const visualSecond = secondEntity.get("Visual");
        const secondPos = new Vector3();
        visualSecond.mesh.getWorldPosition(secondPos);

        const firstCol = firstEntity.get("Collider");
        const secondCol = secondEntity.get("Collider");
        const res = (Math.abs(firstPos.x - secondPos.x) <
            (firstCol.width + secondCol.width) / 2 &&
            Math.abs(firstPos.y - secondPos.y) <
            (firstCol.height + secondCol.height) / 2 &&
            Math.abs(firstPos.z - secondPos.z) <
            (firstCol.depth + secondCol.depth) / 2)
        if (!res && secondEntity.name==='Coin') {
            // console.log(firstPos, secondPos, Math.abs(firstPos.x - secondPos.x),
            //     Math.abs(firstPos.z - secondPos.z),
            //     (firstCol.width + secondCol.width) / 2,
            //     (firstCol.depth + secondCol.depth) / 2);

        }

        return res

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
                    y: mesh.position.y + 4,
                    z: mesh.position.z - 2,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        this.world.removeEntities(object)
                    }
                });
                break;
        }
    }
}