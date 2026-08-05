import {
    BoxGeometry,
    Group,
    Mesh,
    MeshPhongMaterial, Vector3,
} from "three";
import Position from "@/app/game/components/position";
import {gameSetting} from "@/app/game/gameSetting";
import {shuffle} from "@/app/game/shuffle";
import Entity from "@/app/game/entity/entity";
import Visual from "@/app/game/components/visual";
import Collider from "@/app/game/components/сollider";

export default class ObstacleSystem {
    constructor(world) {
        this.world = world;
        this.geometry = new BoxGeometry(...gameSetting.obstacle.size);

        this.material = new MeshPhongMaterial({
            color: gameSetting.obstacle.color,
        });
        this.subscribe();
        this.create();
    }

    subscribe() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            if (!road) continue;
            road.addObserver((event, section) => {
                if (event === "addSafeWay") {
                    this.createObstacle(section)
                }
            });
        }
    }

    create() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            if (!road) continue;
            for (const section of road.safeWay) {
                this.createObstacle(section)
            }
        }
    }

    createObstacle(section) {
        const obstacleChance = 0.5;
        for (let lane = 0; lane < section.path.length; lane++) {
            if (section.path[lane] === 1) continue;
            if (shuffle.random() < obstacleChance) {
                const obstacle = this.createEntity(lane - 1, 0.25, section.positionZ);
                this.world.entities.push(obstacle);
                section.entities.push(obstacle)
                section.path[lane]  = 2;
            }
        }
    }
    createEntity(x, y, z) {
        const mesh = new Mesh(this.geometry, this.material);
        mesh.position.set(x, y, z);
        const entity = new Entity("Obstacle");
        entity.add("Position", new Position(x, y, z));
        entity.add("Visual", new Visual(mesh));
        entity.add("Collider", new Collider(...gameSetting.obstacle.collider));
        return entity;

    }
}