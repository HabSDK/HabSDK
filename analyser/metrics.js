// Proximity between group of components 

// Proximity between types of components
function create_proximity_rule(object_type_list) {
    var eval = (layout) => {
        var objects = [].concat.apply([], layout.rooms.map(o => layout.room_types[o.room_type_name].objects)).filter(o => object_type_list.some(ot => ot.name == o.object_type_name));
        objects.forEach(o => console.log(o.object_type.name));
        return 5;
    } 
    var item_string = "Increase seperatation between";
    for (var i=0;i<object_type_list.length;i++) {
        if (object_type_list.length != 1) {
            if (i == object_type_list.length-1) item_string += " and";
            else item_string += ", ";
        }
        item_string += " "+object_type_list[i]+"s";
    }
    return new Metric(item_string, eval);
}