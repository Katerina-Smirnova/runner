import { CylinderGeometry, Mesh, MeshPhongMaterial} from "three";
import {gameSetting} from "@/app/game/gameSetting";
import {shuffle} from "@/app/game/shuffle";

export default class CoinsSystem {
    constructor(world) {
        this.world = world;
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
                    this.addObjects(section);
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
                this.addObjects(section);
            }
        }
    }

    addObjects(section) {
        this.createCoin(section.path, section.objects);
    }

    createMesh() {
        const geometry = new CylinderGeometry(...gameSetting.coin.size);
        const material = new MeshPhongMaterial({
            color: gameSetting.coin.color,
        });
        const coin = new Mesh(geometry, material);
        coin.rotation.x=1.5
        coin.userData.type = "coin";
        return coin;
    }

    createCoin(path, objects) {
        const coinChance = 0.5;
        for (let lane = 0; lane < path.length; lane++) {
            if (path[lane] === 2) continue;
            if (shuffle.random() < coinChance) {
                const coin = this.createMesh();
                coin.position.set(lane - 1, 0, 0,);
                objects.add(coin);
            }
        }
    }
}