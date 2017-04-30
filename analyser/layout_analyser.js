function analyse(layout) {
    this.rules = [
        new Rule("Objects cannot overlap", check_overlapping),
        new Rule("Objects must be fully within a room", check_objects_in_room),
        create_have_required_amount_of(["bed"], false, 6),
        create_have_required_amount_of(["treadmill"], true, 2),
    ];
    this.metrics = [
        create_proximity_rule(["fridge", "toilet"], true),
        create_proximity_rule(["microscope", "fridge"], true),
        create_proximity_rule(["bed"], false),
        create_have_amount_of(["microscope"], 10, false),
        create_have_amount_of(["cooker"], 5, true),
        create_sum_property("sanity", true),
        create_sum_property("hipster-ness", false),
        create_sum_property("moisture", false),
    ];
    var result = new LayoutResult();
    this.metrics.forEach(metric => {
        var value = metric.evaluator(layout);
        result.metrics[metric.name] = value;
        result.overall_result += value; 
    });       
    this.rules.forEach(rule => {
        var value = rule.evaluator(layout);
        result.rules[rule.name] = value;
        if (value = false) result.overall_result = 0;
    });    
    return result;    
}

// Layouts are graded based upon the metrics.
function Metric(name, evaluator) {
    this.name = name;
    this.weighting = 1;
    this.evaluator = evaluator;
}

// Layouts must abide by rules and are invalid if they don't.
function Rule(name, evaluator) {
    this.name = name;
    this.evaluator = evaluator;
}

function LayoutResult() {
    this.overall_result = 0
    this.metrics = {}
    this.rules = {}

    this.log = () => {
        console.log("\Metrics\n===============");
        Object.keys(this.metrics).forEach(o => console.log(o+" : "+this.metrics[o]));
        console.log("\nRules\n===============");
        Object.keys(this.rules).forEach(o => console.log(o+" : "+this.rules[o]));
    }
}
