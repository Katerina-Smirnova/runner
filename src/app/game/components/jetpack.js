export default class Jetpack {
    constructor(height = 10, duration = 30) {
        this.isActive = false;
        this.height = height;
        this.duration = duration;
        this.startZ = 0;
        this.endZ = 0;
        this.startY = 0.25;
        this.observers = []
        this.way = []
    }

    addObserver(observer) {
        this.observers.push(observer)
    }

    notifyObservers(event, data) {
        this.observers.forEach(observer => {
            observer(event, data)
        })
    }

    addWay(section) {
        this.way.push(section)
        this.notifyObservers('addWay', section)
    }

    removeWay() {
        this.way.shift()
    }
}