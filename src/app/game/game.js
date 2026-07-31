import {
    PerspectiveCamera, Scene, WebGLRenderer, Mesh, MeshPhongMaterial, DirectionalLight, TextureLoader,
    RepeatWrapping, PlaneGeometry, DoubleSide, SphereGeometry, Group, Fog, Color, BoxGeometry,
} from "three";
import {gameSetting} from "@/app/game/gameSetting";
import Entity from "@/app/game/entity/entity";
import Visual from "@/app/game/components/visual";
import Position from "@/app/game/components/position";
import Movement from "@/app/game/components/movement";
import RenderSystem from "@/app/game/system/renderSystem";
import EventInput from "@/app/game/components/eventInput";
import InputSystem from "@/app/game/system/inputSystem";
import MovementSystem from "@/app/game/system/movementSystem";
import PositionSystem from "@/app/game/system/positionSystem";
import World from "@/app/game/world";
import Rotation from "@/app/game/components/rotation";
import Offset from "@/app/game/components/offset";
import GenerateSection from "@/app/game/generateSection";
import MovingForward from "@/app/game/components/movingForward";
import {OrbitControls} from "three/addons";
import Road from "@/app/game/components/rode";
import RoadSystem from "@/app/game/system/roadSystem";
import ObstacleSystem from "@/app/game/system/obstacleSystem";

export class Game {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.render = this.render.bind(this);
        this.world = null;
        this.roadMesh = null
        this.generateLevel = new GenerateSection();
        // this.addObstacle = this.addObstacle.bind(this);
        this.sections = []
        this.distance = 5
        this.groupWorld = new Group()
        this.roadEntity = null
        this.roadSegments=[]
        this.segmentsLength=200
        this.countSegments=3
    }

    init(canvas) {
        this.world = new World()
        this.renderer = new WebGLRenderer({antialias: true, canvas: canvas});
        this.scene = new Scene();
        this.createCamera()
        this.createLight()
        this.createFog()
        this.createRoad()
        // this.createSection()
        const controls = new OrbitControls(this.camera, canvas);
        controls.target.set(0, 0, 0);
        controls.update();


        const ballEntity = new Entity()
        this.roadEntity = new Entity();

        ballEntity.add('Visual', new Visual(this.createBall()))
        ballEntity.add('Position', new Position(...gameSetting.ball.position))
        console.log(ballEntity.position)

        ballEntity.add("Rotation", new Rotation())

        this.roadEntity.add('Visual',  new Visual(this.groupWorld))
        this.roadEntity.add('Position', new Position(...gameSetting.road.position))
        this.roadEntity.add("Road", new Road())
        this.roadEntity.add('EventInput', new EventInput())
        this.roadEntity.add('Movement', new Movement())

        this.world.addEntity(ballEntity);
        this.world.addEntity(this.roadEntity);
        const road = this.roadEntity.get("Road");
        const visual = this.roadEntity.get("Visual")
        let z = -20
        for (let i = 0; i < 10; i++) {
            const section = this.createSection(this.generateLevel.nextSection(), z)
            road.sections.push(section);
            visual.mesh.add(section);
            this.sections.push(section);
            console.log(section.position.z)
            z -= this.distance
        }

        this.world.addSystem(new InputSystem(this.world))
        this.world.addSystem(new MovementSystem())
        this.world.addSystem(new PositionSystem())
        this.world.addSystem(new RenderSystem(this.scene, this.world))
        this.world.addSystem(new RoadSystem(this.roadSegments))
        this.world.addSystem(new ObstacleSystem(this.sections, z))
        requestAnimationFrame(this.render);
    }

    createRoad() {
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(gameSetting.road.texture);

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        texture.repeat.set(...gameSetting.road.repeatTexture);
        const material = new MeshPhongMaterial({
            map: texture,
            side: DoubleSide,
        });
        for(let i = 0; i < this.countSegments; i++) {
            const geometry = new PlaneGeometry(3,this.segmentsLength);
            const road =  new Mesh(geometry, material);
            road.position.set(0,0,-i*this.segmentsLength);
            road.rotation.x = -Math.PI / 2;
            this.roadSegments.push(road);
            this.groupWorld.add(road);
        }

    }

    createFog() {
        this.scene.fog = new Fog(gameSetting.fog.color, gameSetting.fog.near, gameSetting.fog.far);
        this.scene.background = new Color(gameSetting.fog.color);
    }

    createCamera() {
        this.camera = new PerspectiveCamera(
            gameSetting.camera.fov,
            gameSetting.camera.aspect,
            gameSetting.camera.near,
            gameSetting.camera.far);
        this.camera.position.set(...gameSetting.camera.position);
        this.camera.lookAt(0, 2, 0);
    }

    createLight() {
        const light = new DirectionalLight(gameSetting.light.color, gameSetting.light.intensity);
        light.position.set(...gameSetting.light.position);
        this.scene.add(light);
    }

    createObstacle() {
        const geometry = new BoxGeometry(...gameSetting.obstacle.size);
        const material = new MeshPhongMaterial({color: gameSetting.obstacle.color});
        return new Mesh(geometry, material);

    }

    createSection(section,z) {
        const group = new Group()

        for (let lane = 0; lane < section.length; lane++) {
            if (section[lane] === 0) {
                const obstacleMesh = this.createObstacle();
                obstacleMesh.position.set(lane - 1, 0, 0)
                group.add(obstacleMesh);
            }
        }
        const pos = new Position(0,0.2, z)
        group.position.set( pos.x,
            pos.y,
            pos.z)
        return group;
    }

    updateSection() {
        const road = this.roadEntity.get("Road");
        const visual = this.roadEntity.get("Visual");
        const first = road.sections[0];

        // first.position.y -= 0.1;

        if (first.position.y > -5)
            return;

        visual.mesh.remove(first);
        road.sections.shift();

        const last = road.sections.at(-1);

        const section = this.createSection(
            this.generateLevel.nextSection(),
            last.position.y + this.distance
        );

        road.sections.push(section);
        visual.mesh.add(section);
    }


    createBall() {
        const geometry = new SphereGeometry(...gameSetting.ball.size);
        const material = new MeshPhongMaterial({color: gameSetting.ball.color});
        return new Mesh(geometry, material);
    }

    destroy() {
        this.scene.remove.apply(this.scene, this.scene.children);
    }

    resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    render() {
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
        this.world.update();
        // this.updateSection()
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }
}