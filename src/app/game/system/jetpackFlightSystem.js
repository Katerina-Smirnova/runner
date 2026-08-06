export default class JetpackFlightSystem {
    constructor(world) {
        this.isDecline = false;
    }
    update(entities) {
        for (const entity of entities) {
            const jetpack = entity.get("Jetpack");
            if (!jetpack || !jetpack.isActive) continue;
            const position = entity.get("Position");
            const player = entity.get("Player");

            if (position.z <= jetpack.endZ) {
                const targetY = jetpack.startY;
                position.y += (targetY - position.y) * 0.06;
                position.z -=0.5 * 0.08

                if (Math.abs(position.y - targetY) < 0.01) {
                    position.y = targetY;
                    jetpack.isActive = false;
                    player.speed = -0.1;
                    entity.remove("Jetpack");
                }
            }
            else {
                const targetY = jetpack.startY + jetpack.height;
                position.y += (targetY - position.y) * 0.1;
            }



            if (player) player.speed = -0.15;
        }

    }


}