

function Limits3D(min_point, max_point) {
    this.min_point = min_point;
    this.max_point = max_point;

    this.check_intersect = (other_limits) => {
        return false;
    }
}

function Limits2D() {
    function check_intersect(a, b) {
        return (abs(a.x - b.x) * 2 < (a.width + b.width)) && (abs(a.y - b.y) * 2 < (a.height + b.height));
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}