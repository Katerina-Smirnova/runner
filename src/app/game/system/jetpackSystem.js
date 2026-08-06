import {BoxGeometry, Mesh, MeshPhongMaterial} from "three";
import {gameSetting} from "@/app/game/gameSetting";
import {shuffle} from "@/app/game/shuffle";
import Entity from "@/app/game/entity/entity";
import Position from "@/app/game/components/position";
import Visual from "@/app/game/components/visual";
import Collider from "@/app/game/components/сollider";

export default class JetpackSystem{
    constructor(world) {
        this.world = world;
        this.geometry = new BoxGeometry(...gameSetting.jetpack.size);
        this.material = new MeshPhongMaterial({
            color: gameSetting.jetpack.color,
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
                    this.createCoin(section);
                }
            });
        }
    }
    create() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            if (!road) continue;
            for (const section of road.safeWay) {
                this.createCoin(section);
            }
        }
    }
    createCoin(section) {
        const coinChance = 1;
        for (let lane = 0; lane < section.path.length; lane++) {
            if (section.path[lane] === 2) continue;
            if (shuffle.random() < coinChance) {
                const coin = this.createEntity(lane - 1, 0.25, section.positionZ);
                this.world.entities.push(coin);
                section.entities.push(coin)
            }
        }
    }
    createEntity(x, y, z) {
        const mesh = new Mesh(this.geometry, this.material);
        mesh.position.set(x, y, z);

        const entity = new Entity("Jetpack");
        entity.add("Position", new Position(x, y, z));
        entity.add("Visual", new Visual(mesh));
        entity.add("Collider", new Collider(...gameSetting.coin.collider));
        return entity;
    }
}