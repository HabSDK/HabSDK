var fs = require('fs');
eval(fs.readFileSync('spatial.js')+'');
eval(fs.readFileSync('data.js')+'');
eval(fs.readFileSync('object_library.js')+'');

var max_number_of_objects_per_room = 20;
var max_number_of_room_types = 5;
var max_number_of_rooms = 5;
var object_types = new HabObjectTypes();

function create_test_layout() {
    var layout = new HabLayout();
    var number_of_room_types = random_int(1, max_number_of_room_types);
    for (i=1;i<number_of_room_types;i++) {
        layout.room_types.push(create_test_room_type())
    }
    var number_of_rooms = random_int(1, max_number_of_rooms);
    for (i=0;i<number_of_rooms;i++) {
        layout.rooms.push(create_test_room(layout.room_types))
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
        room_type.name = room_names[random_int(0, room_names.length-1)]
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
    object.position = new Point3D(0, 0, 0);
    return object;
}

function save() {
    var layout = this.create_test_layout();
    fs.writeFile("./tmp/test_layout.json", JSON.stringify(layout)) 
}

function generate_fake_objects(){
    var object_types = []
    var sprite_0 = fs.readFile("./tmp/resources/sprites/base.png");
    var sprite_1 = fs.readFile("./tmp/resources/sprites/base.png");
    var sprite_2 = fs.readFile("./tmp/resources/sprites/base.png");
    var sprite_3 = fs.readFile("./tmp/resources/sprites/base.png");
    
    for (i=0;i<100;i++){
        var x = random_int(1, 5);
        var y = random_int(1, 5);
        var z = random_int(1, 5);
        var name = "blah_"+i+" ("+x+","+y+","+z+")";
        object_types.push(new HabObjectType(name, new Point3D(x, y ,z), new Point3D(x, y ,z), new Point3D(0,0,0)))      
        fs.writeFile("./tmp/resources/sprites/"+name+"_0.png", sprite_0);
        fs.writeFile("./tmp/resources/sprites/"+name+"_1.png", sprite_1);
        fs.writeFile("./tmp/resources/sprites/"+name+"_2.png", sprite_2);
        fs.writeFile("./tmp/resources/sprites/"+name+"_3.png", sprite_3);
    }
    fs.writeFile("./tmp/test_object_types.json", JSON.stringify(object_types));
}

function random_int(min, max) {
    return Math.floor((Math.random() * max) + min);
}

room_names = [
    "Attic",
    "Ballroom",      
    "Box Room",	    
    "Cellar",        
    "Cloakroom" , 
    "Conservatory",	
    "Dining Room",
    "Drawing Room",
    "Games Room",
    "Hall",
    "Landing",
    "Larder" ,
    "Library",
    "Music Room",
    "Office",
    "Pantry" ,
    "Parlour" ,
    "Living Room",
    "Spare Room",
    "Guest Room",
    "Toilet",
    "Utility Room",
]