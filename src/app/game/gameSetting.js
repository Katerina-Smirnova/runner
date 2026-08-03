export const gameSetting = {
    camera: {
        fov:60,
        aspect: 2,
        near: 0.1,
        far: 50,
        position: [0, 1, 7.5],
        lokAt:[0, 2, 0],
    },
    light: {
        color: 0xFFFFFF,
        intensity: 3,
        position: [-1, 2, 4],
    },
    ball: {
        position: [0,0.25,4.5],
        size: [0.3, 16, 8],
        color: 0x44aa88,
    },
    obstacle: {
        size: [0.4,0.4,0.4],
        color: 'red',
        startZ:-10,
        distance:5,
    },
    road: {
        texture: '/loader.jpg',
        repeatTexture:[1,20],
        size:{
            width: 3,
            height: 200,
        },
        position:[0,0,0],
    },
    line: {
        left: -1,
        right: 1,
        center: 0
    },
    fog: {
        near:10,
        far: 40,
        color:'black',
    },
}
