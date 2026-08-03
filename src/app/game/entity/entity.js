export default class Entity {
    constructor(name) {
        this.components = new Map();
        this.destroy = false;
        this.name = name;
    }
    add(key, component) {
        this.components.set(key, component);
    }

    get(type) {
        return this.components.get(type);
    }
    getName(){
        return this.name
    }
}