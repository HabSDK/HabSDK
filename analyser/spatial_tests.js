var fs = require('fs');

eval(fs.readFileSync('spatial.js')+''); // Only used for testing

function LimitsTests(){

    this.tests = [
        () => {
            check_intersect_test(new Limits3D(new Point3D(0,0,0), new Point3D(1,1,1)), new Limits3D(new Point3D(0,0,0), new Point3D(1,1,1)), true)
        }
    ]

    this.check_intersect_test() = (a, b, expected) => {
        var result = a.check_intersect(b);
        return assert(expected, result)
    }

    function assert(expected, result) {
        if (expected != result){
            console.log("FAIL: expected "+expected+" but got "+result);
            return false;
        }
        return true;
    }
}