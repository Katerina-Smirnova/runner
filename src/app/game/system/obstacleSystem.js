import {
    BoxGeometry,
    Group,
    Mesh,
    MeshPhongMaterial,
} from "three";
import Position from "@/app/game/components/position";
import {gameSetting} from "@/app/game/gameSetting";
import {shuffle} from "@/app/game/shuffle";

export default class ObstacleSystem {
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
                    this.addObjects(section, visual.mesh);
                }
                if (event === "removeSafeWay") {
                    this.removeObjects(section, visual.mesh);
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
                this.addObjects(section, visual.mesh);
            }
        }
    }

    addObjects(section, mesh) {
        section.objects = this.createSection(section.path, section.positionZ);
        mesh.add(section.objects);
    }

    removeObjects(section, mesh) {
        if (!section.objects) return;
        mesh.remove(section.objects);
    }

    createObstacle() {
        const geometry = new BoxGeometry(...gameSetting.obstacle.size);
        const material = new MeshPhongMaterial({
            color: gameSetting.obstacle.color,
        });
        const obstacle = new Mesh(geometry, material);
        obstacle.userData.type = "obstacle";
        return obstacle;
    }

    createSection(path, z) {
        const group = new Group();
        const obstacleChance = 0.5;
        for (let lane = 0; lane < path.length; lane++) {
            if (path[lane] === 1) continue;
            if (shuffle.random() < obstacleChance) {
                const obstacle = this.createObstacle();
                obstacle.position.set(lane - 1, 0, 0,);
                group.add(obstacle);
                path[lane] = 2;
            }
        }
        const position = new Position(0, 0.2, z);
        group.position.set(
            position.x,
            position.y,
            position.z,
        );

        return group;
    }
}