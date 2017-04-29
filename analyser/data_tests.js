var fs = require('fs');

eval(fs.readFileSync('spatial.js')+''); // Only used for testing
eval(fs.readFileSync('data.js')+''); // Only used for testing

function create_test_layout() {
    var layout = new HabLayout();

    var room = new HabRoomType();
    room.layout = [
        new Point(0,0),
        new Point(10,0),
        new Point(10,10),
        new Point(0,10),
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
        object_types.push(new HabObjectType(name, new Point(x, y ,z), new Point(x, y ,z), new Point(0,0,0)))      
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

save();



