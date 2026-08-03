import {BoxGeometry, Group, Mesh, MeshPhongMaterial} from "three";
import Position from "@/app/game/components/position";
import {gameSetting} from "@/app/game/gameSetting";


export default class ObstacleSystem {
    constructor(world) {
        this.world = world;
        this.subscribe()
        this.create()
    }

    subscribe() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if (!visual || !road) continue;
            road.addObserver((event, section) => {
                if (event === 'addSafeWay') {
                    this.addObstacles(section, visual.mesh);
                } else if (event === 'removeSafeWay') {
                    this.removeObstacles(section, visual.mesh);
                }
            })
        }
    }

    create() {
        for (const entity of this.world.entities) {
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if (!visual || !road) continue;
            for (const safeWay of road.safeWay) {
                this.addObstacles(safeWay, visual.mesh)
            }
        }
    }

    addObstacles(section, mesh) {
        section.obstacles = this.createSection(section.path, section.positionZ);
        mesh.add(section.obstacles);
    }

    removeObstacles(section, mesh) {
        if (section.obstacles) {
            mesh.remove(section.obstacles);
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