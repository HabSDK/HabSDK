function create_proximity_rule(object_type_list, maximise) {
    var eval = (layout) => {
        var score = 0;
        var objects = layout.get_objects_of_type(object_type_list)
        for (i =0;i<objects.length;i++){
            for (j=i+i;j<objects.length;j++) {
                var obj_a = objects[i]; 
                var obj_b = objects[j];
                var distance = obj_a.get_limits().get_centre_point().distance_to(obj_b.get_limits().get_centre_point()) 
                if (maximise) score += distance;
                else score -= distance; 
            }
        }
        return Math.floor(score);
    } 
    var item_string =  " seperation between";
    if (maximise) item_string = "Maximise" + item_string;
    else item_string = "Minimise" + item_string;
    item_string += get_group_text(object_type_list)
    return new Metric(item_string, eval);
}

function create_have_amount_of(object_type_list, maximise) {
    var eval = (layout) => {
        var value = layout.get_objects_of_type(object_type_list).length;
        if (maximise) return value;
        else return -value;
    };
    if (maximise) item_string = "Have more";
    else item_string = "Have less";
    item_string += get_group_text(object_type_list);
    return new Metric(item_string, eval);
}

function create_sum_property(property, maximise) {
    var eval = (layout) => {
        var value = layout.get_objects().reduce((a, b) => {
            var type = b.get_object_type();
            var value = type.properties[property]
            if (value == null) return a;
            if (maximise) return a + value;
            else return a - value;
        }, 0);
        return value;
    };
    if (maximise) item_string = "Maximise ";
    else item_string = "Minimise ";
    item_string += property;
    return new Metric(item_string, eval);
}

function create_floor_plan_metric() {
    var eval = (layout) => {
        var objects = layout.get_objects().filter(o => o.position.z == 0);
        var area = 0;
        objects.forEach(o =>{
            var limits = o.get_object_type().get_limits();
            var local_area = limits.x * limits.y;
            area += local_area;
        });    
        if (area > (40 * 40 * 0.7)) return -area;
        else return 0;   
    };
    return new Metric("Make room for activities", eval);
}

function get_group_text(group) {
    var item_string = "";
    for (var i=0;i<group.length;i++) {
        if (group.length != 1) {
            if (i == group.length-1) item_string += " and";
            else if (i != 0) item_string += ", ";
        }
        item_string += " "+group[i]+"s";
    }
    return item_string;
}