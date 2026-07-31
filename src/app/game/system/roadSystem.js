export default class RoadSystem {
    constructor(segments) {
        this.segments = segments
        this.segmentLength = 200
        this.minSegment = 0
        this.maxSegment = this.segments.length - 1;
    }

    update(entities) {

        for (let entity of entities) {
            const visual = entity.get("Visual");
            const road = entity.get("Road");
            if (road) {
                if (visual.mesh.position.z>(-this.segments[this.minSegment].position.z+this.segmentLength)) {
                    this.segments[this.minSegment].position.z = this.segments[this.maxSegment].position.z - this.segmentLength;
                    this.maxSegment=this.minSegment
                    this.minSegment++;

                    if (this.minSegment >= this.segments.length) {
                        this.minSegment = 0;
                    }
                }
            }
        }
    }
}