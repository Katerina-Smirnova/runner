export const gameSetting = {
    camera: {
        fov:60,
        aspect: 2,
        near: 0.1,
        far: 50,
        position: [0, 1, 7.5],
    },
    light: {
        color: 0xFFFFFF,
        intensity: 3,
        position: [-1, 2, 4],
    },
    ball: {
        position: [0,0.17,5.5],
        size: [0.2, 16, 8],
        color: 0x44aa88,
    },
    obstacle: {
        position: [35, 0.2],
        size: [0.4,0.4,0.4],
        color: 'red',
    },
    road: {
        texture: '/loader.jpg',
        repeatTexture:[1,20],
        size:[3,150,1,80],
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
