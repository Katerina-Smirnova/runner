import {BoxGeometry, Group, Mesh, MeshPhongMaterial} from "three";
import Position from "@/app/game/components/position";
import {gameSetting} from "@/app/game/gameSetting";
import GenerateSection from "@/app/game/generateSection";

export default class ObstacleSystem {
    constructor(world) {
        this.sections = []
        this.world = world;
        this.z = -10
        this.distance = 5
        this.generateLevel = new GenerateSection();
        this.create()
    }
    create(){
        for(const entity of this.world.entities){
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if(road){
                for (let i = 0; i < 10; i++) {
                    const section = this.createSection(this.generateLevel.nextSection(), this.z)
                    road.obstacles.push(section);
                    visual.mesh.add(section);
                    this.sections.push(section);
                    this.z -= this.distance
                }
            }
        }
    }

    update(entities) {
        for (const entity of entities) {
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if (road) {
                if (visual.mesh.position.z > (-this.sections[1].position.z)) {
                    this.sections.shift()
                    const section = this.createSection(this.generateLevel.nextSection(), this.z)
                    road.obstacles.push(section);
                    visual.mesh.add(section);
                    this.sections.push(section);
                    this.z -= this.distance

                }
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

        for (let lane = 0; lane < section.length; lane++) {
            if (section[lane] === 0) {
                const obstacleMesh = this.createObstacle();
                obstacleMesh.position.set(lane - 1, 0, 0)
                group.add(obstacleMesh);
            }
        }
        const pos = new Position(0, 0.2, z)
        group.position.set(pos.x,
            pos.y,
            pos.z)
        return group;
    }
}