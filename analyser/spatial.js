

function Limits3D(min_point, max_point) {
    this.min_point = min_point;
    this.max_point = max_point;

    this.check_intersect = (other_limits) => {
        if (max_point.x < other_limits.min_point.x) return false;
        if (min_point.x > other_limits.max_point.x) return false;
        if (max_point.y < other_limits.min_point.y) return false;
        if (min_point.y < other_limits.max_point.y) return false;
        if (max_point.z < other_limits.min_point.z) return false;
        if (min_point.z < other_limits.max_point.z) return false;
        return true;
    }
}

function Limits2D(min_point, max_point) {
    this.min_point = min_point;
    this.max_point = max_point; 
    
    this.check_intersect() = (other_limits) => { 
        if (max_point.x < other_limits.min_point.x) return false;
        if (min_point.x > other_limits.max_point.x) return false;
        if (max_point.y < other_limits.min_point.y) return false;
        if (min_point.y < other_limits.max_point.y) return false;
        return true;
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