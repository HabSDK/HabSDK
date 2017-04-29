var fs = require('fs');

eval(fs.readFileSync('spatial.js')+''); // Only used for testing
eval(fs.readFileSync('data.js')+''); // Only used for testing

function save() {
    var layout = new HabLayout();

    var room = new HabRoomType();
    room.layout = [
        new Point(0,0),
        new Point(1,0),
        new Point(1,1),
        new Point(0,1),
    ]
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

generate_fake_objects()



