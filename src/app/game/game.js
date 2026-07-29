import {
    BoxGeometry, PerspectiveCamera, Scene, WebGLRenderer, Mesh, MeshPhongMaterial, DirectionalLight, TextureLoader,
    RepeatWrapping, NearestFilter, SRGBColorSpace, PlaneGeometry, DoubleSide,
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

        // this.createRoad();

        this.cube = new Entity()
        this.cube.add('Visual',new Visual(this.createCube()))
        this.road =  new Entity()
        this.road.add('Visual',new Visual(this.createRoad()))
        this.road.add('Position',new Position(...gameSetting.cubePosition))
        this.road.add('Movement',new Movement())
        this.road.add('Input',new Input())
        this.world.addEntity(this.cube);
        // this.renderSystem = new RenderSystem(this.scene)
        this.world.addSystem(new InputSystem(this.world))
        this.world.addSystem(new MovementSystem())
        this.world.addSystem(new PositionSystem())
        this.world.addSystem(new RenderSystem(this.scene))

        requestAnimationFrame(this.render);
    }
    createRoad() {
        const roadGeometry = new  PlaneGeometry(3,200)
        const roadMaterial = new MeshPhongMaterial({color: 0x555555});

        const road = new Mesh(roadGeometry, roadMaterial);

        road.rotation.x = -Math.PI / 2;
        road.position.y=-2

        this.scene.add(road);
        const lineGeometry = new BoxGeometry(0.05,0.01,1000)
        const lineMaterial = new MeshPhongMaterial({color: 'red'});
        const line1 = new Mesh(lineGeometry, lineMaterial);
        const line2 = new Mesh(lineGeometry, lineMaterial);
        line1.position.set(-1, -1, 0);
        line2.position.set(1, 0.02, 0);
        road.add(line1);
        road.add(line2);
        return road

    }

    createCamera() {
        this.camera = new PerspectiveCamera(
            gameSetting.camera.fov,
            gameSetting.camera.aspect,
            gameSetting.camera.near,
            gameSetting.camera.far);
        // this.camera.position.z =3;
        this.camera.position.set(0,0,3)
        this.camera.lookAt(0, 0, 0);
    }

    createCube() {
        const geometry = new BoxGeometry(
            gameSetting.cubeSize.width,
            gameSetting.cubeSize.height,
            gameSetting.cubeSize.depth);
        const material = new MeshPhongMaterial({ color: 0x44aa88 });
        return new Mesh(geometry, material)
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
        this.world.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

}