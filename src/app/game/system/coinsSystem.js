import {BoxGeometry, CylinderGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial} from "three";
import {gameSetting} from "@/app/game/gameSetting";
import {shuffle} from "@/app/game/shuffle";
import Entity from "@/app/game/entity/entity";
import Position from "@/app/game/components/position";
import Visual from "@/app/game/components/visual";
import Collider from "@/app/game/components/сollider";

export default class CoinsSystem {
    constructor(world) {
        this.world = world;
        this.geometry = new CylinderGeometry(...gameSetting.coin.size);
        this.material = new MeshPhongMaterial({
                    color: gameSetting.coin.color,
        });
        this.subscribe();
        this.create();
    }

    subscribe() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            const jetpack = entity.get("Jetpack");
            if (road) {
                road.addObserver((event, section) => {
                    if (event === "addSafeWay") {
                        this.createCoin(section, 0.5);
                    }
                });
            }
            if (jetpack) {
                jetpack.addObserver((event, section) => {
                    if (event === "addWay") {
                        this.createCoin(section, 1);
                    }
                });
            }
        }
    }
    create() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            if (!road) continue;
            for (const section of road.safeWay) {
                this.createCoin(section,0.5);
            }
        }
    }
    createCoin(section, probability) {
        for (let lane = 0; lane < section.path.length; lane++) {
            if (section.path[lane] === 2) continue;
            if (shuffle.random() < probability) {
                const coin = this.createEntity(lane - 1, section.positionY, section.positionZ);
                this.world.entities.push(coin);
                section.entities.push(coin);
                section.path[lane]  = 2;
            }
        }
    }
    createEntity(x, y, z) {
        const mesh = new Mesh(this.geometry, this.material);
        mesh.rotation.x=gameSetting.coin.rotation;
        mesh.position.set(x, y, z);

        const entity = new Entity("Coin");
        entity.add("Position", new Position(x, y, z));
        entity.add("Visual", new Visual(mesh));
        entity.add("Collider", new Collider(...gameSetting.coin.collider));
        return entity;
    }
}