import {
    PerspectiveCamera, Scene, WebGLRenderer, Mesh, MeshPhongMaterial, DirectionalLight, TextureLoader,
    RepeatWrapping, PlaneGeometry, DoubleSide, SphereGeometry, Group,
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

export class Game {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.render = this.render.bind(this);
        this.world = null;
        this.roadMesh=null
        this.generateLevel = new GenerateSection();
        this.addObstacle = this.addObstacle.bind(this);
    }

    init(canvas) {
        this.world = new World()
        this.renderer = new WebGLRenderer({antialias: true, canvas: canvas});
        this.scene = new Scene();
        this.createCamera()
        this.createLight()

        const ballEntity = new Entity()
        const road = new Entity()
        this.roadMesh = this.createRoad();

        ballEntity.add('Visual', new Visual(this.createBall()))
        road.add('Visual', new Visual(this.roadMesh))

        road.add("Offset", new Offset())

        ballEntity.add('Position', new Position(...gameSetting.ball.position))
        road.add('Position', new Position(...gameSetting.road.position))


        road.add('Movement', new Movement())
        road.add('EventInput', new EventInput())
        ballEntity.add("Rotation", new Rotation())

        this.world.addEntity(ballEntity);
        this.world.addEntity(road);

        this.world.addSystem(new InputSystem(this.world))
        this.world.addSystem(new MovementSystem())
        this.world.addSystem(new PositionSystem())
        this.world.addSystem(new RenderSystem(this.scene, this.world))
        console.log(this.world)
        this.addObstacle()

        requestAnimationFrame(this.render);
    }

    createRoad() {
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(gameSetting.road.texture);

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        texture.repeat.set(...gameSetting.road.repeatTexture);
        const roadGeometry = new PlaneGeometry(...gameSetting.road.size)
        const roadMaterial = new MeshPhongMaterial({
            map: texture,
            side: DoubleSide,
        });
        const road = new Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        return road
    }

    createCamera() {
        this.camera = new PerspectiveCamera(
            gameSetting.camera.fov,
            gameSetting.camera.aspect,
            gameSetting.camera.near,
            gameSetting.camera.far);
        this.camera.position.set(...gameSetting.camera.position);
    }

    createLight() {
        const light = new DirectionalLight(gameSetting.light.color, gameSetting.light.intensity);
        light.position.set(...gameSetting.light.position);
        this.scene.add(light);
    }

    createObstacle(x) {
        const geometry = new SphereGeometry(...gameSetting.obstacle.size);
        const material = new MeshPhongMaterial({color: gameSetting.obstacle.color});

        const obstacleMesh = new Mesh(geometry, material);
        const obstacle = new Entity()
        const pos = new Position(x, ...gameSetting.obstacle.position);
        obstacle.add("Position", pos);
        obstacleMesh.position.set(
            pos.x,
            pos.y,
            pos.z
        );
        this.roadMesh.add(obstacleMesh);
        obstacle.add('Visual', new Visual(obstacleMesh))
        obstacle.add('MovingForward', new MovingForward())

        this.world.addEntity(obstacle);

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
    addObstacle() {
        const section = this.generateLevel.nextSection();
        for (let lane = 0; lane < section.length; lane++) {
            if (section[lane] === 0) {
                this.createObstacle(lane - 1);
            }
        }
        setTimeout(this.addObstacle, 500);

    }

    render() {

        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }

        this.world.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

    generateLevel() {
        const sections = []

    }

}