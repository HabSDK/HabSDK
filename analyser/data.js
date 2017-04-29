function HabLayout() {
    this.title = "";
    this.rooms = [];
    this.room_types = {};
    this.size = new Point2D(0,0);

    this.get_objects = () => [].concat.apply([], this.rooms.map(o => this.room_types[o.room_type_name].objects));
    this.get_objects_of_type = (object_type_list) => this.get_objects().filter(o => object_type_list.some(ot => ot.name == o.object_type_name)); 
}
function HabRoom() {
    this.room_type_name = "";
    this.position = new Point2D(0,0);
}
function HabRoomType() {
    this.name = "";
    this.objects = []; 
    this.floor_plan = [];
    this.get_polygon = () => {
        var polygon = new Polygon();
        polygon.points = this.floor_plan;
        return polygon;
    }
}
function HabObject() {
    this.object_type_name = ""
    this.position = new Point3D(0,0,0);
    this.rotation = 0;

    this.get_limits = () => {    
        var size = null
        var object_type = object_types.filter(o => o.name == this.object_type_name)[0]
        if (this.rotation == 0 || this.rotation == 2) size = new Point2D(object_type.limits.x, object_type.limits.y)
        else size = new Point2D(object_type.limits.x, object_type.limits.y)
        var limits = new Limits3D(this.position, this.position.add(new Point3D(size.x, size.y, object_type.limits.z)))
        return limits;
    } 
}
function HabObjectType(name, limits) {
    this.name = name;
    this.limits = limits;
}
var object_types = HabObjectTypes()