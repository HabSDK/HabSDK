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


}