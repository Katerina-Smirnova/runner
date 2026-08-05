import gsap from "gsap";
import {gameSetting} from "@/app/game/gameSetting";

export default class PositionSystem {
    update(entities) {
        for (const entity of entities) {
            const movement = entity.get("Movement");
            const position = entity.get("Position");
            const rotation = entity.get("Rotation");
            const visual = entity.get("Visual");
            position.z += rotation?.speed ?? 0;
            position.x += movement?.dx ?? 0;
            if (movement) {
                if (movement.jumpRequested && !movement.isJumping) {
                    this.startJump(entity, position, movement,visual);
                    movement.jumpRequested = false;
                }

                movement.dx = 0;
            }
        }
    }

    startJump(entity, position, movement,visual) {
        movement.isJumping = true;
        const jumpHeight = movement.jumpHeight;
        const jumpDuration = movement.jumpDuration;
        const startY = position.y;
        const time = movement.time;
        const squashX = 0.2
        const squashY = 0.1
        const baseSize = gameSetting.ball.collider
        const scale = visual.mesh.scale
        visual.mesh.rotation.z += 0;

        const tween = gsap.timeline({
            onComplete: () => {
                movement.isJumping = false;
                scale.set(1, 1, 1);
                position.y=startY
            }
        })
            .to(scale, {
                duration: 0.08,
                x: 1.1,
                y: 0.8,
                z: 1.1,
                ease: "power2.out"
            })
            .to(position, {
                duration: time / 2,
                y: startY + jumpHeight,
                ease: "power1.out",
            },"<")
            // растягиваем
            .to(scale, {
                duration: time / 4,
                x: 0.8,
                y: 1.1,
                z: 0.8,
                ease: "sine.inOut"
            }, "<")
            // начальное
            .to(scale, {
                duration: time / 4,
                x: 1,
                y: 1,
                z: 1,
                ease: "none",
            }, ">")

            .to(position, {
                duration: time / 2,
                y: startY,
                ease: "power1.in",
            })
            // растягиваем
            .to(scale, {
                duration: time / 4,
                x: 0.8,
                y: 1.1,
                z: 0.8,
                ease: 'power1.inOut',
            }, `<+=${time / 6}`)
            //сжимаем
            .to(scale, {
                duration: time / 4,
                x: 1.1,
                y: 0.8,
                z: 1.1,
                ease: "power2.out"
            })
            .to(scale, {
                duration: 0.05,
                x: 1,
                y: 1,
                z: 1,
                ease: "power1.out"
            })

        // gsap.to(position, {
        // y: startY + jumpHeight,
        // duration: jumpDuration,
        // ease: "power2.inOut",
        // yoyo: true,
        // repeat: 1,
        // onComplete: () => {
        //     position.y = startY;
        //     movement.isJumping = false;
        //
        // }
        // });

    }

}