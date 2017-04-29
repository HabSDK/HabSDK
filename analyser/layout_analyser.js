function Analyser() {

    this.rules = [
        new Rule("Objects cannot overlap", check_overlapping)
    ];
    this.metrics = [
        
    ];
    this.analyse_metric() = (layout) => {
        var results = {}
        for (metric in this.metrics){
            var result = metric.evaluator(layout);
            results[metric.name] = result;
        }        
        return results;
    }
    this.analyse_valid() = (layout) => {
        var results = {}
        for (rule in this.rules){
            var result = rule.evaluator(layout);
            results[rule.name] = result;
        }        
        return results;
    }
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

function check_overlapping(layout) { 
    for (room in layout.rooms) {
        for (i =0;i<room.objects.length;i++){
            for (j=i+i;j<room.objects.length;j++) {
                var obj_a = room.objects[i]; 
                var obj_b = room.objects[j];
                var does_intersect = obj_a.get_limits().check_overlapping(obj_b.get_limits())
                if (does_intersect) return false
            }
        }
    }
    return true;
}