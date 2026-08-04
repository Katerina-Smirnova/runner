import {Sphere, Vector3} from "three";
import {gameSetting} from "@/app/game/gameSetting";
import gsap from "gsap";


export default class CollisionSystem {
    constructor(world) {
        this.world = world;;
        this.objectPos = new Vector3();
    }

    update(entities) {
        const ball = entities.find(e => e.getName() === "ball");
        if (!ball)
            return;

        const collidable = entities.filter(entity => entity !== ball &&
            entity.get("Collider") &&
            entity.get("Position")
        );
        // console.log('collidable', collidable);

        for (const entity of collidable) {
            if (!this.checkCollision(ball, entity))
                continue;
            this.onCollision(entity);
        }

    }

    checkCollision(firstEntity, secondEntity) {
        const firstMesh = firstEntity.get("Visual").mesh;
        const secondMesh = secondEntity.get("Visual").mesh;

        const firstPos = firstMesh.getWorldPosition(new Vector3());
        const secondPos = secondMesh.getWorldPosition(new Vector3());
        const firstCol = firstEntity.get("Collider");
        const secondCol = secondEntity.get("Collider");

        return (
            Math.abs(firstPos.x - secondPos.x) <=
            (firstCol.width + secondCol.width) / 2 &&

            Math.abs(firstPos.y - secondPos.y) <=
            (firstCol.height + secondCol.height) / 2 &&

            Math.abs(firstPos.z - secondPos.z) <=
            (firstCol.depth + secondCol.depth) / 2
        );
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
                    z: mesh.position.z + 2,
                    duration: 0.5,
                    ease: "power2.out",
                    // onComplete: () => {
                    //    this.world.removeEntities(object)
                    // }
                });

                break;
        }
    }
}