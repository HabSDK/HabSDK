
const fs = require('fs');

var sourcepath = '../analyser/';
var sources = ['layout_analyser.js','data.js','spatial.js','object_library.js'];

eval(fs.readFileSync(sourcepath+'layout_analyser.js')+'');
eval(fs.readFileSync(sourcepath+'data.js')+'');
eval(fs.readFileSync(sourcepath+'spatial.js')+'');
eval(fs.readFileSync(sourcepath+'object_library.js')+'');

module.exports = {
  analyse: Analyser
};
