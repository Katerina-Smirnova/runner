export default class Jetpack {
    constructor(isActive = false, height = 5, duration = 30) {
        this.isActive = isActive;
        this.height = height;
        this.duration = duration;
        this.startZ = 0;
        this.endZ = 0;
        this.startY = 0;
    }
}