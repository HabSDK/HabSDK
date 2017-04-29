function analyse(layout) {
    this.rules = [
        new Rule("Objects cannot overlap", check_overlapping)
    ];
    this.metrics = [
        create_proximity_rule(["chair"])
    ];
    var result = new LayoutResult();
    this.metrics.forEach(metric => {
        result.metrics[metric.name] = metric.evaluator(layout);
    });       
    this.rules.forEach(rule => {
        result.rules[rule.name] = rule.evaluator(layout);
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
        Object.keys(result.metrics).forEach(o => console.log(o+" : "+result.metrics[o]));
        console.log("\nRules\n===============");
        Object.keys(result.rules).forEach(o => console.log(o+" : "+result.rules[o]));
    }
}

function check_overlapping(layout) { 
    for (room_type in layout.room_types) {
        for (i =0;i<room_type.objects.length;i++){
            for (j=i+i;j<room_type.objects.length;j++) {
                var obj_a = room_type.objects[i]; 
                var obj_b = room_type.objects[j];
                var result = obj_a.get_limits().intersect(obj_b.get_limits())
                if (result) return false
            }
        }
    }
    return true;
}

function check_objects_in_room(layout) {
    for (room_type in layout.room_types) {
        var room_polygon = room_type.get_polygon()
        for (object in room_type.objects) {
            var result = room_polygon.contains_limits(object.get_limits())
            if (result) return false
        }
    }
}