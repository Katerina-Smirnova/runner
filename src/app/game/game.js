import {
    PerspectiveCamera, Scene, WebGLRenderer, Mesh, MeshPhongMaterial, DirectionalLight, TextureLoader,
    RepeatWrapping, PlaneGeometry, DoubleSide, SphereGeometry, Group, Fog, Color, BoxGeometry, Box3, BoxHelper,
    Box3 as Shere,
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
import Road from "@/app/game/components/rode";
import RoadSystem from "@/app/game/system/roadSystem";
import ObstacleSystem from "@/app/game/system/obstacleSystem";
import {OrbitControls} from "three/addons";
import GenerateSection from "@/app/game/generateSection";
import SafeWaySystem from "@/app/game/system/safeWaySystem";
import Collision from "@/app/game/components/collisions";
import CollisionSystem from "@/app/game/system/CollisionsSystem";


export class Game {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.render = this.render.bind(this);
        this.world = null;
        this.groupWorld = new Group()
        this.roadEntity = new Entity('road');
        this.roadSegments=[];
        this. ballEntity = new Entity('ball')
    }

    init(canvas) {
        this.world = new World()
        this.renderer = new WebGLRenderer({antialias: true, canvas: canvas});
        this.scene = new Scene();
        this.createCamera()
        this.createLight()
        this.createFog()
        this.createRoad()

        const controls = new OrbitControls(this.camera, canvas);
        controls.target.set(0, 0, 0);
        controls.update();
        const generator = new GenerateSection

        generator.nextSection()
        const ball= this.createBall()
        this.ballEntity.add('Visual', new Visual(ball))
        this.ballEntity.add('Position', new Position(...gameSetting.ball.position))
        const box = new Shere().setFromObject(ball)
        // this.ballEntity.add("Collision", new Collision(ball, this.ballEntity))
        this.ballEntity.add("Rotation", new Rotation())

        this.roadEntity.add('Visual',  new Visual(this.groupWorld))
        this.roadEntity.add('Position', new Position(...gameSetting.road.position))
        this.roadEntity.add("Road", new Road(this.roadSegments))
        this.roadEntity.add('EventInput', new EventInput())
        this.roadEntity.add('Movement', new Movement())

        this.world.addEntity(this.ballEntity);
        this.world.addEntity(this.roadEntity);

        this.world.addSystem(new InputSystem(this.world))
        this.world.addSystem(new MovementSystem())
        this.world.addSystem(new PositionSystem())
        this.world.addSystem(new RenderSystem(this.scene))
        this.world.addSystem(new RoadSystem())
        this.world.addSystem(new SafeWaySystem(this.world))
        this.world.addSystem(new ObstacleSystem(this.world))
        this.world.addSystem(new CollisionSystem(this.world))
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
        for(let i = 0; i < 3; i++) {
            const geometry = new PlaneGeometry(gameSetting.road.size.width,gameSetting.road.size.height);
            const road =  new Mesh(geometry, material);
            road.position.set(0,0,-i*gameSetting.road.size.height);
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
        this.camera.lookAt(...gameSetting.camera.lokAt);
    }

    createLight() {
        const light = new DirectionalLight(gameSetting.light.color, gameSetting.light.intensity);
        light.position.set(...gameSetting.light.position);
        this.scene.add(light);
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
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }
}