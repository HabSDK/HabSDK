var max_number_of_objects_per_room = 20;
var max_number_of_room_types = 20;
var max_number_of_rooms = 10;
var object_types = HabObjectTypes();

function create_test_layout() {
    var layout = new HabLayout();
    var number_of_room_types = random_int(1, max_number_of_room_types);
    for (i=1;i<number_of_room_types;i++) {
        var room_type = create_test_room_type();
        layout.room_types[room_type.name] = room_type;
    }
    var number_of_rooms = random_int(1, max_number_of_rooms);
    for (i=0;i<number_of_rooms;i++) {
        layout.rooms.push(create_test_room(Object.keys(layout.room_types)))
    }
    return layout;
}

function create_test_room(room_types) {
    var room = new HabRoom();
    room.room_type_name = room_types[random_int(0,room_types.length-1)]
    return room;
}

function create_test_room_type() {
        var room_type = new HabRoomType();
        room_type.name = room_names[random_int(0, room_names.length-1)]+" "+random_int(0, 1000000)
        room_type.layout = [
            new Point2D(0,0),
            new Point2D(10,0),
            new Point2D(10,10),
            new Point2D(0,10),
        ];
        var number_of_objects = random_int(0, max_number_of_objects_per_room);
        for (i=0;i<number_of_objects;i++) {
            room_type.objects.push(create_test_object())
        }
    return room_type
}

function create_test_object() {
    var object = new HabObject();
    object.object_type_name = object_types[random_int(0, object_types.length-1)].name
    object.position = new Point3D(random_int(0, 30), random_int(0, 30), random_int(0, 30));
    return object;
}

var object_types = HabObjectTypes()