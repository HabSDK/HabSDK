function Analyser() {

    this.metrics = [
        new Metric("overlapping components", check_overlapping)
    ];

    this.analyse() = (room) => {

    }
}

function Metric(name, evaluator) {
    this.name = name;
    this.evaluator = evaluator;
}

function check_overlapping(layout) {
    // Check no objects in a room overlap

}

function Limits(min_point, max_point) {
    this.min_point = min_point;
    this.max_point = max_point;

    this.check_overlap = (other_limits) => {
        
    }
}

function Limits2D() {
    function check_intersect(a, b) {
    return (abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (abs(a.y - b.y) * 2 < (a.height + b.height));
    }
}