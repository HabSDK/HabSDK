// Proximity between group of components 

// Proximity between types of components
function sdfsdf(component_type_list, closer_is_better) {

    var eval = (layout) => {

    } 
    var item_string = "Increase seperatation between ";
    for (var i=0;i<component_type_list.length;i++) {
        if (i == component_type_list.length-1) item_string += " and";
        else item_string += ", ";
        item_string += " "+component_type_list[i]+"s";
    }
    return new Metric(item_string, eval)
}