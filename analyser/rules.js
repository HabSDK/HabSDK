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
    return Object.keys(layout.room_types).some(room_type_name => {
        var room_type = layout.room_types[room_type_name];
        var room_polygon = room_type.get_polygon()
        return room_type.objects.some(object => {
            var object_limits3D = object.get_limits();
            var object_limits2D = new Limits2D(new Point2D(object_limits3D.min_point.x, object_limits3D.min_point.y), new Point2D(object_limits3D.max_point.x, object_limits3D.max_point.y));
            return !room_polygon.contains_limits(object_limits2D);
        });
    });
}

function create_have_required_amount_of(object_type_list, maximum, amount) {
    var eval = (layout) => {
        var value = layout.get_objects_of_type(object_type_list).length;
        if (maximum) return value < amount;
        else return value > amount;
    };
    if (maximum) item_string = "Have no more than "+amount;
    else item_string = "Have at least "+amount;
    item_string += get_group_text(object_type_list);
    return new Metric(item_string, eval);
}