export default class Road {
    constructor(sections) {
        this.sections = sections;
        this.safeWay =[]
        this.speed = 0.1
        this.observers =[]
    }
    addObserver(observer) {
        this.observers.push(observer)
    }
    notifyObservers(event,data) {
        this.observers.forEach(observer => {observer(event,data)})
    }
    addSafeWay(section) {
        this.safeWay.push(section)
        this.notifyObservers('addSafeWay',section)
    }
    removeSafeWay() {
        this.safeWay.shift()
    }
}