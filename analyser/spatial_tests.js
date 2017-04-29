var fs = require('fs');

eval(fs.readFileSync('spatial.js')+''); // Only used for testing

function SpatialTests(){

    this.tests = [
        
    ]

    this.check_intersect_test = (a, b, expected) => {
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

    this.run = () => {
        var fails = 0;
        var passes = 0;

        tests = check_intersect_test(new Limits3D(new Point3D(0,0,0), new Point3D(1,1,1)), new Limits3D(new Point3D(0,0,0), new Point3D(1,1,1)), true)

        for (test in this.tests) {
            var result = test();
            if (result) passes += 1;
            else fails += 1;
        }
        console.log(passes+' tests passed.')
        console.log(fails+' tests failed.')
    } 
}

var tests = new SpatialTests()
tests.run()