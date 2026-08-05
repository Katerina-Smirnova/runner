import {Vector3} from "three";

export default class CameraSystem {
    constructor(camera) {
        this.camera = camera;
        this.currentPosition = new Vector3();
        this.height = 1.2;
        this.width = 2.5;
        this.lookTarget = new Vector3();
        this.isInitialized = false;
        this.alpha = 0.05
    }

    update(entities) {
        const ball = entities.find(e => e.getName() === "ball");
        if (!ball)
            return;
        const position = ball.get("Position");
        this.currentPosition.set(
            position.x,
            position.y + this.height,
            position.z + this.width
        );
        if (!this.isInitialized) {
            this.camera.position.copy(this.currentPosition);
            this.lookTarget.set(position.x, position.y + this.height, position.z);
            this.camera.lookAt(this.lookTarget)
            this.isInitialized = true;
            return;
        }
        this.camera.position.lerp(this.currentPosition, this.alpha);
        this.lookTarget.lerp(new Vector3(position.x, position.y + this.height, position.z),
            this.alpha);
        this.camera.lookAt(this.lookTarget);
    }

}