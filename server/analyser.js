
const fs = require('fs');

var sourcepath = '../analyser/';

eval(fs.readFileSync(sourcepath+'spatial.js')+'');
eval(fs.readFileSync(sourcepath+'metrics.js')+'');
eval(fs.readFileSync(sourcepath+'rules.js')+'');
eval(fs.readFileSync(sourcepath+'layout_analyser.js')+'');
eval(fs.readFileSync(sourcepath+'object_library.js')+'');
eval(fs.readFileSync(sourcepath+'data.js')+'');

module.exports = {
  analyse: analyse
};
