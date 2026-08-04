import {Sphere, Vector3} from "three";
import {gameSetting} from "@/app/game/gameSetting";
import gsap from "gsap";


export default class CollisionSystem {
    constructor(world) {
        this.world = world;
        this.sphere = new Sphere();
        this.vector = new Vector3();
        this.objectPos = new Vector3();
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
        for (const group of road.safeWay) {
            for (const object of group.objects.children) {
                if (this.checkCollision(this.sphere, object)) {
                    this.onCollision(object, road);
                    break;
                }
            }
        }

    }

    checkCollision(sphere, object) {
        object.getWorldPosition(this.objectPos);
        const distance = Math.sqrt(
            (this.objectPos.x - sphere.center.x) ** 2 +
            (this.objectPos.y - sphere.center.y) ** 2 +
            (this.objectPos.z - sphere.center.z) ** 2
        );
        const objectSize = 0.3;
        const collisionRadius = sphere.radius + objectSize;
        return distance < collisionRadius;
    }

    onCollision(object, road) {
        switch (object.userData.type) {
            case "obstacle":
                this.world.stopPlay()
                console.log("Game over")
                break;
            case"coin":
                this.world.countCoins += 1
                gsap.to(object.position, {
                    y: this.objectPos.y + 2,
                    Z: this.objectPos.z + 2,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        road.safeWay.forEach((section) => {
                            section.objects.remove(object)
                        })
                    }
                })
                break;


        }
    }
}