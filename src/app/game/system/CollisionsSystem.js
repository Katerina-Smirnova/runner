export default class CollisionSystem {
    constructor(world) {
        this.world = world;
        // this.getAllObstacles(this.world)
        this.update(this.world)
    }

    update(entities) {
        const ball = entities.find(entity => entity.name === 'ball');
        const road = entities.find(entity => entity.name === 'road');
        console.log(ball,road, 'ball');
        if (ball) {
            const obstacles = this.getAllObstacles(road)
            console.log(obstacles)
            for (const obstacle of obstacles) {
                // if (this.checkСollision(ball.position, obstacle)) {
                //     ball.rotation.x = 0
                //     road.speed = 0
                //
                // }

            }
        }
    }

    checkСollision(sphere, box) {
        const x = Math.max(box.minX, Math.min(sphere.x, box.maxX));
        const y = Math.max(box.minY, Math.min(sphere.y, box.maxY));
        const z = Math.max(box.minZ, Math.min(sphere.z, box.maxZ));

        const distance = Math.sqrt(
            (x - sphere.x) * (x - sphere.x) +
            (y - sphere.y) * (y - sphere.y) +
            (z - sphere.z) * (z - sphere.z),
        );

        return distance < sphere.radius;
    }

    getAllObstacles(roadEntity) {
        const obstacles = [];
        const road = roadEntity.get("Road")
        console.log(road)
        obstacles.push(road.safeWay[0].obstacles.children);
        return obstacles;
    }

}