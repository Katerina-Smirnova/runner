export default class InputSystem {
    constructor(world) {
        this.world = world;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.startX = 0
        window.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('mousedown', this.handleMouseDown)
        window.addEventListener('mouseup', this.handleMouseUp)

    }

    getInputs() {
        return this.world.query("EventInput");
    }

    handleKeyDown(e) {
        for (const entity of this.getInputs()) {
            const input = entity.get("EventInput");
            if (e.keyCode === 39 || e.keyCode === 68) {
                input.direction = 'right'
            } else if (e.keyCode === 37 || e.keyCode === 65) {
                input.direction = 'left'
            }else if (e.keyCode === 38 || e.keyCode === 68) {
                input.direction = 'up'
            }
        }
    }

    handleMouseDown(e) {
        this.startX = e.clientX;
    }

    handleMouseUp(e) {
        for (const entity of this.getInputs()) {
            const input = entity.get("EventInput");
            if (e.clientX > this.startX) {
                input.direction = 'right'
            } else if (e.clientX < this.startX) {
                input.direction = 'left'
            }
        }
    }


}