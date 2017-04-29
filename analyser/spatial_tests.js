var fs = require('fs');

eval(fs.readFileSync('spatial.js')+''); // Only used for testing


var a = new Polygon()
a.points = [
    new Point2D(0,0),
    new Point2D(1,0),
    new Point2D(1,1),
    new Point2D(0,1),
];

var test = new Point2D(0.5, 0.5);

if (a.contains_point(test)) console.log("TRUE");
else console.log("FALSE");