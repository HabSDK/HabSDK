var fs = require('fs');
eval(fs.readFileSync('spatial.js')+'');
eval(fs.readFileSync('metrics.js')+'');
eval(fs.readFileSync('rules.js')+'');
eval(fs.readFileSync('layout_analyser.js')+'');
eval(fs.readFileSync('object_library.js')+'');
eval(fs.readFileSync('data_tests.js')+'');

//var layout = create_test_layout();
//var result = analyse(layout);
//
//result.log()

var obj_types = new HabObjectTypes()
fs.writeFile("./tmp/object_types.json", JSON.stringify(obj_types))