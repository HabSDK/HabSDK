function create_proximity_rule(object_type_list, maximise) {
    var eval = (layout) => {
        var score = 0;
        var objects = layout.get_objects()
        //var objects = layout.get_objects_of_type(object_type_list)
        console.log(objects.length)
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
    var item_string =  " seperatation between";
    if (maximise) item_string = "Maximise" + item_string;
    else item_string = "Minimise" + item_string;
    for (var i=0;i<object_type_list.length;i++) {
        if (object_type_list.length != 1) {
            if (i == object_type_list.length-1) item_string += " and";
            else item_string += ", ";
        }
        item_string += " "+object_type_list[i]+"s";
    }
    return new Metric(item_string, eval);
}

function create_have_amount_of(object_type_list, weight, maximise) {
    var eval = (layout) => layout.get_objects_of_type(object_type_list).sum() * weight;
    var item_string =  " seperatation between";
    if (maximise) item_string = "Maximise" + item_string;
    else item_string = "Minimise" + item_string;
    for (var i=0;i<object_type_list.length;i++) {
        if (object_type_list.length != 1) {
            if (i == object_type_list.length-1) item_string += " and";
            else item_string += ", ";
        }
        item_string += " "+object_type_list[i]+"s";
    }
    return new Metric(item_string, eval);
}