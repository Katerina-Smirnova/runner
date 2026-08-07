export default class EntityIndex{
    constructor() {
        this.entityComponents = new Map()
        this.componentEntitys = new Map()
    }
    add(entity) {
        this.entityComponents.set(entity,   new Set(entity.components.keys()))
        for(let component of entity.components.keys()){
            if(!this.componentEntitys.has(component)){
                this.componentEntitys.set(component, new Set())
            }
            this.componentEntitys.get(component).add(entity)
        }
    }
    getEntity(component) {
        return this.componentEntitys.get(component)
    }
    getComponent(entity) {
        return this.entityComponents.get(entity)
    }
    // hasComponent(entityName,componentName) {
    //     const entity = this.entityComponents.get(entityName)
    //     return  entity.has(componentName)
    // }
    // hasEntity(entityName,componentName) {
    //     const component = this.entityComponents.get(componentName)
    //     return  component.has(entityName)
    // }
    getEntitiesSeveral(...components) {
        if (components.length === 0) return new Set();

        const first = this.componentEntitys.get(components[0]);
        if (!first) return new Set();

        const result = new Set(first);

        for (let i = 1; i < components.length; i++) {
            const entities = this.componentEntitys.get(components[i]);
            if (!entities) return new Set();

            for (const entity of result) {
                if (!entities.has(entity)) {
                    result.delete(entity);
                }
            }
        }
        return result;
    }
}