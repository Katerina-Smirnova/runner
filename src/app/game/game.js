import {
    PerspectiveCamera, Scene, WebGLRenderer, Mesh, MeshPhongMaterial, DirectionalLight, TextureLoader,
    RepeatWrapping, PlaneGeometry, DoubleSide, SphereGeometry,
} from "three";
import {gameSetting} from "@/app/game/gameSetting";
import Entity from "@/app/game/entity/entity";
import Visual from "@/app/game/components/Visual";
import Position from "@/app/game/components/Position";
import Movement from "@/app/game/components/Movement";
import RenderSystem from "@/app/game/System/RenderSystem";
import EventInput from "@/app/game/components/EventInput";
import InputSystem from "@/app/game/System/InputSystem";
import MovementSystem from "@/app/game/System/MovementSystem";
import PositionSystem from "@/app/game/System/PositionSystem";
import World from "@/app/game/World";
import Rotation from "@/app/game/components/Rotation";
import Offset from "@/app/game/components/Offset";

export class Game {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.render = this.render.bind(this);
        this.world = null;
    }

    init(canvas) {
        this.world = new World()
        this.renderer = new WebGLRenderer({antialias: true, canvas: canvas});
        this.scene = new Scene();
        this.createCamera()
        this.createLight()

        const ballEntity = new Entity()
        const road =  new Entity()

        ballEntity.add('Visual',new Visual(this.createBall()))
        road.add('Visual',new Visual(this.createRoad()))

        road.add("Offset", new Offset())

        ballEntity.add('Position',new Position(...gameSetting.ball.position))
        road.add('Position',new Position(0,-2,0))

        ballEntity.add('Movement',new Movement())
        ballEntity.add('EventInput',new EventInput())
        ballEntity.add("Rotation", new Rotation())

        this.world.addEntity(ballEntity);
        this.world.addEntity(road);

        this.world.addSystem(new InputSystem(this.world))
        this.world.addSystem(new MovementSystem())
        this.world.addSystem(new PositionSystem())
        this.world.addSystem(new RenderSystem(this.scene))

        requestAnimationFrame(this.render);
    }
    createRoad() {
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(gameSetting.road.texture);

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        texture.repeat.set(...gameSetting.road.repeatTexture);
        const roadGeometry = new  PlaneGeometry(...gameSetting.road.size)
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
    createLight(){
        const light = new DirectionalLight( gameSetting.light.color, gameSetting.light.intensity );
        light.position.set( ...gameSetting.light.position);
        this.scene.add( light );
    }

    createBall() {
        const geometry = new SphereGeometry(...gameSetting.ball.size);
        const material = new MeshPhongMaterial({ color: gameSetting.ball.color });
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