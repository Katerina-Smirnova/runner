export default class JetpackFlightSystem {
    constructor(world) {
        this.world=world
        this.height = 5;
        this.startZ = 0;
        this.endZ = this.startZ + 200;
        this.isJetpack = false;
    }

    start(startZ) {
        this.startZ = startZ;
        const playerEntity = this.world.entities.find(e => e.getName() === "ball");
        const visual = playerEntity.get("Visual");
        const position = playerEntity.get("Position");
        position.y +=this.height
    }
}