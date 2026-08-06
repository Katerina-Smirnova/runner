export default class Movement {
    constructor(y, scale) {
        this.dx = 0;
        this.dy = 0;

        this.isJumping = false;
        this.jumpRequested = false;
        this.jumpHeight = 1;
        this.time = 0.8;
        this.startY = y;
        this.countJumps = 2;
        this.scale = {...scale};
        this.jumpTween = null;
    }
}