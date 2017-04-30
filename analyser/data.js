function HabLayout() {
    this.title = "";
    this.rooms = [];
    this.room_types = {};
    this.size = new Point2D(0,0);

    this.get_objects = () => [].concat.apply([], this.rooms.map(o => this.room_types[o.room_type_name].objects));
    this.get_objects_of_type = (object_type_list) => this.get_objects().filter(o => object_type_list.some(ot => ot == o.object_type_name)); 
}
function HabRoom() {
    this.room_type_name = "";
    this.position = new Point2D(0,0);
}
function HabRoomType() {
    this.name = "";
    this.objects = []; 
    this.floor_plan = [];
    this.get_polygon = () => {
        var polygon = new Polygon();
        polygon.points = this.floor_plan;
        return polygon;
    }
}
function HabObject() {
    this.object_type_name = ""
    this.position = new Point3D(0,0,0);
    this.rotation = 0;

    this.get_limits = () => {    
        var size = null
        var object_type = this.get_object_type();
        if (this.rotation == 0 || this.rotation == 2) size = new Point2D(object_type.limits.x, object_type.limits.y)
        else size = new Point2D(object_type.limits.x, object_type.limits.y)
        var limits = new Limits3D(this.position, this.position.add(new Point3D(size.x, size.y, object_type.limits.z)))
        return limits;
    } 
    this.get_object_type = () => object_types.find(o => o.name == this.object_type_name);
}
function HabObjectType(name, limits, properties) {
    this.name = name;
    this.limits = limits;
    this.properties = properties;
}

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