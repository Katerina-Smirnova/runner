export const gameSetting = {
    camera: {
        fov: 60,
        aspect: 2,
        near: 0.01,
        far: 50,
    },
    light: {
        color: 0xFFFFFF,
        intensity: 3,
        position: [-1, 2, 4],
    },
    ball: {
        position: [0, 0.25, 4.5],
        size: [0.3,32, 16],
        color: 0x44aa88,
        collider: [0.6, 0.6, 0.6]

    },
    obstacle: {
        size: [0.4, 0.4, 0.4],
        color: 'red',
        collider: [0.4, 0.4, 0.4]
    },
    road: {
        texture: '/loader.jpg',
        repeatTexture: [1, 20],
        size: {
            width: 3,
            height: 200,
        },
        position: [0, 0, 0],
    },
    line: {
        left: -1,
        right: 1,
        center: 0
    },
    fog: {
        near: 10,
        far: 40,
        color: 'black',
    },
    safeWay: {
        startZ: -10,
        distance: 2,
    },
    coin: {
        size: [0.15, 0.15, 0.05],
        color: 'yellow',
        collider: [0.3,0.05, 0.3],
        rotation: 1.5,
    },
    label: {
        color: 'white',
        size: '50px',
    },
    jump: {
        squashX: 0.15,
        squashY: 0.08,
        squashZ: 0.15,
    },
    jetpack:{
        color:"green",
        size:[0.2, 0.2, 0.1],
    }
}
