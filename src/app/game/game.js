import {
    PerspectiveCamera, Scene, WebGLRenderer, Mesh, MeshPhongMaterial, DirectionalLight, TextureLoader,
    RepeatWrapping, PlaneGeometry, DoubleSide, SphereGeometry, Group, Fog, Color, BoxGeometry, MeshBasicMaterial,
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
import Player from "@/app/game/components/player";
import Road from "@/app/game/components/rode";
import RoadSystem from "@/app/game/system/roadSystem";
import ObstacleSystem from "@/app/game/system/obstacleSystem";
import {CSS2DRenderer,} from "three/addons";
import GenerateSection from "@/app/game/generateSection";
import SafeWaySystem from "@/app/game/system/safeWaySystem";
import CollisionSystem from "@/app/game/system/collisionsSystem";
import CoinsSystem from "@/app/game/system/coinsSystem";
import Collider from "@/app/game/components/сollider";
import CameraSystem from "@/app/game/system/cameraSystem";
import JetpackSystem from "@/app/game/system/jetpackSystem";
import JetpackFlightSystem from "@/app/game/system/jetpackFlightSystem";
import Jetpack from "@/app/game/components/jetpack";


export class Game {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.render = this.render.bind(this);
        this.world = null;
        this.groupWorld = new Group()
        this.roadEntity = new Entity('road');
        this.roadSegments = [];
        this.ballEntity = new Entity('ball');
        this.labelRenderer = null
        this.scoreLabel = null
    }

    init(canvas) {
        this.world = new World()
        this.renderer = new WebGLRenderer({antialias: true, canvas: canvas});
        this.scene = new Scene();

        this.createLight()
        this.createFog()
        this.createRoad()
        this.createCamera()

        const ui = document.createElement('div');
        ui.style.position = 'absolute';
        ui.style.top = '0';
        ui.style.left = '0';
        ui.style.width = '100%';
        ui.style.display = 'flex';
        ui.style.justifyContent = 'center';
        ui.style.alignItems = 'center';
        ui.style.padding = '10px';
        ui.style.gap = '10px';
        canvas.parentElement.appendChild(ui);
        this.scoreLabel = document.createElement('div');
        this.scoreLabel.className = 'label';
        this.scoreLabel.style.color = gameSetting.label.color;
        this.scoreLabel.style.fontSize = gameSetting.label.size;
        this.scoreLabel.textContent = `Счет: ${this.world.countCoins}`;
        ui.appendChild(this.scoreLabel);

        const button = document.createElement('button');
        button.className = 'button';
        button.textContent = 'Пауза';
        button.style.fontSize = gameSetting.button.size;
        button.addEventListener('click', () => {
            this.world.isPause = !this.world.isPause;
        });
        ui.appendChild(button);

        const generator = new GenerateSection

        generator.nextSection()
        const ball = this.createBall()
        const position = new Position(...gameSetting.ball.position);
        // this.camera.lookAt(position);
        this.ballEntity.add('Position', position);
        this.ballEntity.add('Visual', new Visual(ball));
        this.ballEntity.add("Player", new Player());
        this.ballEntity.add("Collider", new Collider(...gameSetting.ball.collider));
        this.ballEntity.add('EventInput', new EventInput())
        this.ballEntity.add('Movement', new Movement(position.y, ball.scale))
        this.ballEntity.add("Jetpack",new Jetpack())

        this.roadEntity.add('Visual', new Visual(this.groupWorld))
        this.roadEntity.add('Position', new Position(...gameSetting.road.position))
        this.roadEntity.add("Road", new Road(this.roadSegments))

        this.world.addEntity(this.ballEntity);
        this.world.addEntity(this.roadEntity);

        this.world.addSystem(new InputSystem(this.world))
        this.world.addSystem(new MovementSystem())
        this.world.addSystem(new PositionSystem())

        this.world.addSystem(new RoadSystem())
        this.world.addSystem(new SafeWaySystem(this.world))
        this.world.addSystem(new ObstacleSystem(this.world))
        this.world.addSystem(new CoinsSystem(this.world))
        this.world.addSystem(new JetpackSystem(this.world))
        this.world.addSystem(new CollisionSystem(this.world))
        this.world.addSystem(new RenderSystem(this.scene))
        this.world.addSystem(new CameraSystem(this.camera))
        this.world.addSystem(new JetpackFlightSystem(this.world))

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
        for (let i = 0; i < 3; i++) {
            const geometry = new PlaneGeometry(gameSetting.road.size.width, gameSetting.road.size.height);
            const road = new Mesh(geometry, material);
            road.position.set(0, 0, -i * gameSetting.road.size.height);
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
        this.scoreLabel.textContent = `Счет: ${this.world.countCoins}`;
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }
}