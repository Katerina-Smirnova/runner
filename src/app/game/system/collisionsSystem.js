import {Vector3} from "three";
import gsap from "gsap";

export default class CollisionSystem {
    constructor(world) {
        this.world = world;
    }

    getEntity(component) {
        return this.world.queryEntitiesSeveral(component);
    }

    update(entities) {
        const ball = entities.find(e => e.getName() === "ball");
        if (!ball)
            return;
        for (const entity of this.getEntity("Collider", "Position")) {
            if (entity === ball) continue
            if (!this.checkCollision(ball, entity))
                continue;
            this.onCollision(entity);
        }
    }

    checkCollision(firstEntity, secondEntity) {
        const visual = firstEntity.get("Visual")
        const firstPos = new Vector3();
        visual.mesh.getWorldPosition(firstPos);

        const visualSecond = secondEntity.get("Visual");
        const secondPos = new Vector3();
        visualSecond.mesh.getWorldPosition(secondPos);

        const firstCol = firstEntity.get("Collider");
        const secondCol = secondEntity.get("Collider");
        return (Math.abs(firstPos.x - secondPos.x) <
            (firstCol.width + secondCol.width) / 2 &&
            Math.abs(firstPos.y - secondPos.y) <
            (firstCol.height + secondCol.height) / 2 &&
            Math.abs(firstPos.z - secondPos.z) <
            (firstCol.depth + secondCol.depth) / 2)
    }

    onCollision(object) {
        const mesh = object.get("Visual").mesh;
        const ball = this.world.entities.find(e => e.getName() === "ball");
        switch (object.name) {
            case "Obstacle":
                const player = ball.get("Player");
                if (player.immunity) break
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
            case"Jetpack":
                ball.get("Jetpack").isActive = true;
                ball.get("Jetpack").startZ = ball.get("Position").z;
                ball.get("Jetpack").endZ = ball.get("Position").z - 30;
                this.world.removeEntities(object);
                break;
        }
    }
}