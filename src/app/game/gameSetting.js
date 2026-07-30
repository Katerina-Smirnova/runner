export const gameSetting = {
    camera: {
        fov: 75,
        aspect: 2,
        far: 50,
        near: 0.1,
        position: [0, 0, 3],
    },
    light: {
        color: 0xFFFFFF,
        intensity: 3,
        position: [-1, 2, 4],
    },
    fog: {
        near: 1,
        far: 2,
        color: 'white',
    },
    ball: {
        position: [0,-0.5, 1.9],
        size: [0.15, 16, 8],
        color: 0x44aa88,
    },
    obstacle: {
        position: [35, 0.2],
        size: [0.1, 16, 8],
        color: 'red',
    },
    road: {
        texture: '/loader.jpg',
        repeatTexture:[1,20],
        size:[3,300],
        position:[0,-1,0],
    },
    line: {
        left: -1,
        right: 1,
        center: 0
    }


}
