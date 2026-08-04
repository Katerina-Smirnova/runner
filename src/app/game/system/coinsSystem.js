import { CylinderGeometry, Mesh, MeshPhongMaterial} from "three";
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
            const visual = entity.get("Visual");
            if (!road || !visual) continue;
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
            const visual = entity.get("Visual");
            if (!road || !visual) continue;
            for (const section of road.safeWay) {
                this.createCoin(section);
            }
        }
    }

    createCoin(section) {
        const coinChance = 0.5;
        for (let lane = 0; lane < section.path.length; lane++) {
            if (section.path[lane] === 2) continue;
            if (shuffle.random() < coinChance) {
                const coin = this.createEntity(lane - 1, 0, 0, section.objects);
                this.world.entities.push(coin);
                section.entities.push(coin)
            }
        }
    }
    createEntity(x, y, z, parentGroup) {
        const mesh = new Mesh(this.geometry, this.material);
        mesh.rotation.x=1.5
        mesh.position.set(x, y, z);
        parentGroup.add(mesh);
        const entity = new Entity("Coin");
        entity.add("Position", new Position(x, y, z));
        entity.add("Visual", new Visual(mesh));
        entity.add("ParentGroup", parentGroup);
        entity.add("Collider", new Collider(...gameSetting.coin.size));
        return entity;

    }
}