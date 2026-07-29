import {
    BoxGeometry, PerspectiveCamera, Scene, WebGLRenderer, Mesh, MeshPhongMaterial, DirectionalLight, TextureLoader,
    RepeatWrapping, NearestFilter, SRGBColorSpace, PlaneGeometry, DoubleSide, SphereGeometry,
} from "three";
import {gameSetting} from "@/app/game/gameSetting";
import {EntityComponentSystem} from "javascript-entity-component-system";
import Entity from "@/app/game/entity/entity";
import Visual from "@/app/game/components/Visual";
import Position from "@/app/game/components/Position";
import Movement from "@/app/game/components/Movement";
import RenderSystem from "@/app/game/System/RenderSystem";
import Input from "@/app/game/components/Input";
import InputSystem from "@/app/game/System/InputSystem";
import MovementSystem from "@/app/game/System/MovementSystem";
import PositionSystem from "@/app/game/System/PositionSystem";
import World from "@/app/game/World";
import {OrbitControls} from "three/addons";

export class Game {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.cube = null;
        this.material = null;
        this.render = this.render.bind(this);
        this.world = null;
        this.renderSystem =  null
        this.road = null;
        this.ball = null;
    }

    init(canvas) {
        this.world = new World()

        this.renderer = new WebGLRenderer({antialias: true, canvas: canvas});
        this.scene = new Scene();
        this.createCamera()
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new DirectionalLight( color, intensity );
        light.position.set( - 1, 2, 4 );
        this.scene.add( light );

        this.cube = new Entity()
        this.cube.add('Visual',new Visual(this.createCube()))
        this.road =  new Entity()
        this.road.add('Visual',new Visual(this.createRoad()))
        this.cube.add('Position',new Position(...gameSetting.cubePosition))
        this.road.add('Position',new Position(0,-2,0))

        this.road.add('Movement',new Movement())
        this.road.add('Input',new Input())
        this.world.addEntity(this.cube);
        this.world.addEntity(this.road);
        // this.renderSystem = new RenderSystem(this.scene)
        this.world.addSystem(new InputSystem(this.world))
        this.world.addSystem(new MovementSystem())
        this.world.addSystem(new PositionSystem())
        this.world.addSystem(new RenderSystem(this.scene))
        console.log(this.world)

        requestAnimationFrame(this.render);
    }
    createRoad() {
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load('/loader.jpg');

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        texture.repeat.set(1, 20);

        this.roadTexture = texture

        const roadGeometry = new  PlaneGeometry(3,300)
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
        this.camera.position.set(0, 0, 3);
        this.camera.lookAt(0, 0, -20);
    }

    createCube() {
        const geometry = new SphereGeometry(0.3, 16, 8);
        const material = new MeshPhongMaterial({ color: 0x44aa88 });
        this.ball =new Mesh(geometry, material)
        return this.ball
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
    render(){

        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
        this.roadTexture.offset.y += 0.01;
        this.ball.rotation.x += 0.06;
        this.world.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

}