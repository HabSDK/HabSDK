function analyse(layout) {
    this.rules = [
        new Rule("Objects cannot overlap", check_overlapping)
    ];
    this.metrics = [
        create_proximity_rule(["fridge", "toilet"], true),
        create_proximity_rule(["bed"], false),
        create_have_amount_of(["microscope"], 10, false),
        create_have_amount_of(["cooker"], 5, true),
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
    Object.keys(layout.room_types).forEach(room_type_name => {
        var room_type = layout.room_types[room_type_name];
        for (i =0;i<room_type.objects.length;i++){
            for (j=i+i;j<room_type.objects.length;j++) {
                var obj_a = room_type.objects[i]; 
                var obj_b = room_type.objects[j];
                var result = obj_a.get_limits().intersect(obj_b.get_limits())
                if (result) return false
            }
        }
    });
    return true;
}

function check_objects_in_room(layout) {
    Object.keys(layout.room_types).forEach(room_type_name => {
        var room_type = layout.room_types[room_type_name];
        var room_polygon = room_type.get_polygon()
        for (object in room_type.objects) {
            var result = room_polygon.contains_limits(object.get_limits())
            if (result) return false
        }
    });
}