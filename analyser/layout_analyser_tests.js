var fs = require('fs');
eval(fs.readFileSync('spatial.js')+'');
eval(fs.readFileSync('metrics.js')+'');
eval(fs.readFileSync('layout_analyser.js')+'');
eval(fs.readFileSync('data_tests.js')+'');
eval(fs.readFileSync('object_library.js')+'');

//var layout = create_test_layout();
//
//Object.keys(layout.room_types).forEach(room_type => console.log(room_type+" : "+layout.room_types[room_type]))
//
//var result = analyse(layout);

var obj_types = new HabObjectTypes()
fs.writeFile("./tmp/test_layout.json", JSON.stringify(obj_types))