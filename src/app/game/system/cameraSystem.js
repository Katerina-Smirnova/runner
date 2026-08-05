import {Vector3} from "three";

export default class CameraSystem {
    constructor(camera) {
        this.camera = camera;
        this.currentPosition = new Vector3();
        this.height=1.5;
        this.width=3;
        this.lookTarget=new Vector3();
    }
    update(entities) {
        const ball = entities.find(e => e.getName() === "ball");
        if (!ball)
            return;
        const position = ball.get("Position");
        // const visual = ball.get("Visual")
        // const position = new Vector3();
        // visual.mesh.getWorldPosition(position);
        this.currentPosition.set(
            position.x,
            position.y + this.height,
            position.z + this.width
        );
        const offset = new Vector3(0, 1, 3);
        // this.currentPosition.copy(position).add(offset);
        this.camera.position.lerp(this.currentPosition, 0.05);
        this.lookTarget.lerp(new Vector3(position.x, position.y, position.z),
            0.05);

        this.camera.lookAt(this.lookTarget);
    }

}