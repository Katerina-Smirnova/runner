export default class GenerateSection{
    constructor(){
        this.sections = []
       this.generate()
    }
    generate(){
        let section;

        do {
            section = Array.from({ length: 3 }, () => Math.round(Math.random()));
        } while (!section.includes(1));
        this.enqueue(section);
    }
    enqueue(element){
        this.sections.push(element)
    }
    dequeue(){
        this.generate()
        return this.sections.shift()

    }
}