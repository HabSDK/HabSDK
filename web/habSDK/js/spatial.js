function Limits3D(min_point, max_point) {
    this.min_point = min_point;
    this.max_point = max_point;

    this.intersect = (other_limits) => {
        if (max_point.x < other_limits.min_point.x) return false;
        if (min_point.x > other_limits.max_point.x) return false;
        if (max_point.y < other_limits.min_point.y) return false;
        if (min_point.y < other_limits.max_point.y) return false;
        if (max_point.z < other_limits.min_point.z) return false;
        if (min_point.z < other_limits.max_point.z) return false;
        return true;
    }

    this.get_centre_point = () => {
        var x = (this.max_point.x + this.min_point.x) / 2.0;
        var y = (this.max_point.y + this.min_point.y) / 2.0;
        var z = (this.max_point.z + this.min_point.z) / 2.0;
        var p = new Point3D(x, y, z);
        return p;
    }

    this.toString = () => this.min_point+" to "+this.max_point;
}

function Limits2D(min_point, max_point) {
    this.min_point = min_point;
    this.max_point = max_point; 
    
    this.get_corner_points = () => {
        return [
            this.min_point,
            new Point2D(this.min_point.x, this.max_point.y),
            this.max_point,
            new Point2D(this.max_point.x, this.min_point.y),
        ]
    } 

    this.intersect = (other_limits) => { 
        if (max_point.x < other_limits.min_point.x) return false;
        if (min_point.x > other_limits.max_point.x) return false;
        if (max_point.y < other_limits.min_point.y) return false;
        if (min_point.y < other_limits.max_point.y) return false;
        return true;
    }
}

function Polygon() {
    this.points = []

    this.contains_point = (point) => {
        var angle = 0
        var p1 = null;
        var p2 = null;
        for (var i=0;i<this.points.length;i++) {
           p1 = this.points[i].subtract(point);
           p2 = this.points[(i+1)%this.points.length].subtract(point);
           angle += p1.get_angle(p2);
        }
        if (Math.abs(angle) < Math.pi) return false;
        else return true; 
    }

    this.contains_limits = (limits) => {
        var points = limits.get_corner_points()
        for (point in points) {
            if (!this.contains_point(point)) return false;
        }
        return true;
    }
}

function Point2D(x, y) {
    this.x = x;
    this.y = y;

    this.add = (other) => {
        return new Point2D(this.x + other.x, this.y + other.y)
    }
    this.subtract = (other) => {
        return new Point2D(this.x - other.x, this.y - other.y)
    }
    this.get_angle = (other) => {
        var theta1 = Math.atan2(this.y,this.x);
        var theta2 = Math.atan2(other.y,other.x);
        var dtheta = theta2 - theta1;
        while (dtheta > Math.pi)
           dtheta -= 2 * Math.pi;
        while (dtheta < -Math.pi)
           dtheta += 2 * Math.pi;
        return dtheta;
    }
        this.toString = () => "("+this.x+","+this.y+")";
}

function Point3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.add = (other) => {
        return new Point3D(this.x+other.x, this.y+other.y, this.z+other.z)
    }

    this.distance_to = (other) => {
        var dis = Math.sqrt((this.x + other.x)*(this.x + other.x)+(this.y + other.y)*(this.y + other.y)+(this.z + other.z)*(this.z + other.z))
        return dis;
    }

    this.toString = () => "("+this.x+","+this.y+","+this.z+")";
}