export default class Entity {
    constructor() {
        this.components = new Map();
        this.destroy = false;
    }
    add(key, component) {
        this.components.set(key, component);
    }

    get(type) {
        return this.components.get(type);
    }
}