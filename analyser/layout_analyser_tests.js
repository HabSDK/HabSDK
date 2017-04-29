var fs = require('fs');
eval(fs.readFileSync('spatial.js')+'');
eval(fs.readFileSync('metrics.js')+'');
eval(fs.readFileSync('layout_analyser.js')+'');
eval(fs.readFileSync('data_tests.js')+'');
eval(fs.readFileSync('object_library.js')+'');

var layout = create_test_layout();
var result = analyse(layout);
console.log("\Metrics\n===============");
Object.keys(result.metrics).forEach(o => console.log(o+" : "+result.metrics[o]));
console.log("\nRules\n===============");
Object.keys(result.rules).forEach(o => console.log(o+" : "+result.rules[o]));