import {BoxGeometry, Group, Mesh, MeshPhongMaterial} from "three";
import Position from "@/app/game/components/position";
import {gameSetting} from "@/app/game/gameSetting";
import GenerateSection from "@/app/game/generateSection";

export default class ObstacleSystem {
    constructor(sections,z) {
        this.sections = sections
        this.z = z
        this.distance = 5
        this.generateLevel = new GenerateSection();
        console.log(this.sections)
    }

    update(entities) {
        for (const entity of entities) {
            const road = entity.get("Road");
            const visual = entity.get("Visual")
            if (road) {
                console.log(this.sections[1].position.z, visual.mesh.position.z)
                if (visual.mesh.position.z > (-this.sections[1].position.z)) {
                    console.log('new')
                    this.sections.shift()
                    const section = this.createSection(this.generateLevel.nextSection(), this.z)
                    road.sections.push(section);
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