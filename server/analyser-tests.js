
const fs = require('fs');

var sourcepath = '../analyser/';

eval(fs.readFileSync(sourcepath+'data_tests.js')+'');

module.exports = {
  create_test_layout: create_test_layout
};
