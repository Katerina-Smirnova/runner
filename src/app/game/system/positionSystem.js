import gsap from "gsap";
import {gameSetting} from "@/app/game/gameSetting";

export default class PositionSystem {
    constructor(world) {
        this.world = world;
    }
    update() {
        for (const entity of this.getEntity("Position")) {
            const movement = entity.get("Movement");
            const position = entity.get("Position");
            const player = entity.get("Player");
            const visual = entity.get("Visual");
            const jetpack = entity.get("Jetpack");
            position.z += player?.speed ?? 0;
            if (movement) {
                position.x += movement.dx;
                if (movement.jumpRequested && !movement.isJumping && !jetpack.isActive) {
                    movement.countJumps -= 1
                    this.startJump(position, movement, visual);
                    movement.jumpRequested = false;
                }
                movement.dx = 0;
                movement.jumpRequested = false;
            }
        }
    }
    getEntity(component) {
        return this.world.queryEntity(component);
    }

    startJump(position, movement, visual) {
        if (movement.countJumps === 0) {
            movement.isJumping = true;
        }
        if (movement.jumpTween) {
            movement.jumpTween.kill()
            visual.mesh.scale.set(
                movement.scale.x,
                movement.scale.y,
                movement.scale.z
            );
        }
        const time = movement.time;
        const squashX = gameSetting.jump.squashX
        const squashY = gameSetting.jump.squashY
        const squashZ = gameSetting.jump.squashZ
        const baseSize = movement.scale
        movement.jumpTween = gsap.timeline({
            onComplete: () => {
                movement.isJumping = false;
                movement.countJumps = 2;
            }
        })
            .to(visual.mesh.scale, {
                duration: 0.08,
                x: baseSize.x * (1 + squashX),
                y: baseSize.y * (1 - squashY),
                z: baseSize.z * (1 + squashZ),
                ease: "power2.out"
            })
            .to(position, {
                duration: time / 2,
                y: position.y + movement.jumpHeight,
                ease: "power1.out",
            }, "<")
            // растягиваем
            .to(visual.mesh.scale, {
                duration: time / 4,
                x: baseSize.x * (1 - squashX),
                y: baseSize.y * (1 + squashY),
                z: baseSize.z * (1 - squashZ),
                ease: "sine.inOut"
            }, "<")
            // начальное
            .to(visual.mesh.scale, {
                duration: time / 4,
                x: baseSize.x,
                y: baseSize.y,
                z: baseSize.z,
                ease: "none",
            }, ">")

            .to(position, {
                duration: time / 2,
                y: movement.startY,
                // z: position.z - 5,
                ease: "power1.in",
            })
            // растягиваем
            .to(visual.mesh.scale, {
                duration: time / 4,
                x: baseSize.x * (1 - squashX),
                y: baseSize.y * (1 + squashY),
                z: baseSize.z * (1 - squashZ),
                ease: 'power1.inOut',
            }, `<+=${time / 6}`)
            //сжимаем
            .to(visual.mesh.scale, {
                duration: time / 4,
                x: baseSize.x * (1 + squashX),
                y: baseSize.y * (1 - squashY),
                z: baseSize.z * (1 + squashZ),
                ease: "power2.out"
            })
            .to(visual.mesh.scale, {
                duration: 0.08,
                x: baseSize.x,
                y: baseSize.y,
                z: baseSize.z,
                ease: "power1.out"
            })
    }

}