
const fs = require('fs');

var sourcepath = '../analyser/';

eval(fs.readFileSync(sourcepath+'metrics.js')+'');
eval(fs.readFileSync(sourcepath+'spatial.js')+'');
eval(fs.readFileSync(sourcepath+'data.js')+'');
eval(fs.readFileSync(sourcepath+'object_library.js')+'');

function create_test_layout() {
    var layout = new HabLayout();

    var room = new HabRoomType();
    room.layout = [
        new Point2D(0,0),
        new Point2D(10,0),
        new Point2D(10,10),
        new Point2D(0,10),
    ]

    var types = new HabObjectTypes();

    var object_a = new HabObject();
    object_a.object_type_name = types.chair.name;
    object_a.position = new Point3D(0, 0, 0);
    room.objects.push(object_a);

    var object_b = new HabObject();
    object_b.object_type_name = types.chair.name;
    object_b.position = new Point3D(1, 1, 0);
    room.objects.push(object_b);

    return layout;
}

module.exports = {
  create_test_layout: create_test_layout
};
