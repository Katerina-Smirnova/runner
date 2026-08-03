import {BoxGeometry, Group, Mesh, MeshPhongMaterial} from "three";
import Position from "@/app/game/components/position";
import {gameSetting} from "@/app/game/gameSetting";


export default class ObstacleSystem {
    constructor(world) {
        this.world = world;
        this.create()

    }

    create() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if (!road) continue;
            for (const safeWay of road.safeWay) {
                safeWay.obstacles = this.createSection(safeWay.path, safeWay.positionZ);
                visual.mesh.add(safeWay.obstacles);
            }
        }
    }

    update(entities) {
        for (const entity of entities) {
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if (!road) continue;
            if (road.isChanged) {
                const first = road.safeWay[0];
                visual.mesh.remove(first.obstacle);
                const last = road.safeWay[road.safeWay.length - 1];
                last.obstacle = this.createSection(last.path, last.positionZ);
                visual.mesh.add(last.obstacle);
                road.safeWay.shift()
                road.isChanged=false;

            }
        }
    }

    createObstacle() {
        const geometry = new BoxGeometry(...gameSetting.obstacle.size);
        const material = new MeshPhongMaterial({color: gameSetting.obstacle.color});
        return new Mesh(geometry, material);

    }

    createSection(section, z) {
        const group = new Group()
        const obstacleChance = 0.5
        for (let lane = 0; lane < section.length; lane++) {
            if (section[lane] === 1) continue;

            if (Math.random() < obstacleChance) {
                const obstacleMesh = this.createObstacle();
                obstacleMesh.position.set(lane - 1, 0, 0);
                group.add(obstacleMesh);
            }
        }
        const pos = new Position(0, 0.2, z)
        group.position.set(pos.x, pos.y, pos.z)
        return group;
    }
}