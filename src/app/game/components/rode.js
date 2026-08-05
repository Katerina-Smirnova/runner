export default class Road {
    constructor(sections) {
        this.sections = sections;
        this.safeWay =[]
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