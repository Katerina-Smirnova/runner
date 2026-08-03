import {Box3, BoxHelper} from "three";

export default class Collision {
    constructor(object, entity) {
        this.object = object;
        this.entity = entity;
        this.create(this.object);
    }
    create(object){
        const box = new Box3().setFromObject(object);
        const boxColor = new BoxHelper(object,0xffff00)
        const visual = this.entity.get("Visual");
        visual.mesh.add(boxColor);
    }

}