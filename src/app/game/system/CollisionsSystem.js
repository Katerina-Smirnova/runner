import {Box3, Sphere, Vector3} from "three";
import {gameSetting} from "@/app/game/gameSetting";

export default class CollisionSystem {
    constructor(world) {
        this.world = world;
        // this.getAllObstacles(this.world)

        this.box = new Box3();
        this.sphere = new Sphere();
        this.vector = new Vector3();
        this.tempBox = new Box3();
        this.objectPos = new Vector3();
        // this.update(this.world)
    }

    update(entities) {
        const ballEntity = entities.find(entity => entity.name === 'ball');
        const roadEntity = entities.find(entity => entity.name === 'road');
        if (!ballEntity || !roadEntity) return;
        const ball = ballEntity.get("Visual").mesh;
        const road = roadEntity.get("Road");
        ball.getWorldPosition(this.vector);
        this.sphere.center.copy(this.vector);
        this.sphere.radius = gameSetting.ball.size[0];
        const firstSection = road.safeWay[0];
        if (!firstSection || !firstSection.objects) return;
        for (const object of firstSection.objects.children) {
            if (this.checkCollision(this.sphere, object)) {
                this.onCollision(object, road);
                break;
            }
        }
    }

    checkCollision(sphere, object) {
        console.log(sphere.center,this.tempBox)
        object.getWorldPosition(this.objectPos);
        const distance = Math.sqrt(
            (this.objectPos.x - sphere.center.x) ** 2 +
            (this.objectPos.y - sphere.center.y) ** 2 +
            (this.objectPos.z - sphere.center.z) ** 2
        );
        const objectSize = 0.5;
        const collisionRadius = sphere.radius + objectSize;

        return distance < collisionRadius;
    }
    onCollision(object, road) {

        switch (object.userData.type) {
            case "obstacle":
                road.speed = 0;
                console.log("Game Over");
                break;
        }

    }
}