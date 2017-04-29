function HabLayout() {
    this.title = "";
    this.rooms = [];
    this.size = new Point(0,0);
}
function HabRoom() {
    this.room_type = null;
    this.room_type_name = "";
    this.position = new Point(0,0);
}
function HabRoomType() {
    this.name = "";
    this.objects = []; 
    this.floor_plan = [];
}
function HabObject() {
    this.object_type_name = ""
    this.position = new Point(0,0,0);
    this.rotation = 0;
    this.get_limits = () => {    
        var size = null
        if (rotation == 0 || rotation == 2) size = new Point2D(this.object_type.limits.max_point.x, this.object_type.limits.max_point.y)
        else size = new Point2D(this.object_type.limits.max_point.x, this.object_type.limits.max_point.y)
        return new Limits3D(position, position + new Point3D(size.x, size.y, this.object_type.max_point.z))
    } 
}
function HabObjectType(name, limits, user_limits) {
    this.name = name;
    this.limits = limits;
    this.user_limits = user_limits;
}