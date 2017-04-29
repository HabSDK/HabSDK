function HabLayout() {
    this.title = "";
    this.rooms = [];
    this.size = new Point(0,0);
}
function HabRoom() {
    this.room = null;
    this.position = new Point(0,0);
}
function HabRoomType() {
    this.name = "";
    this.objects = []; 
    this.floor_plan = [];
}
function HabObject() {
    this.object = "";
    this.position = new Point(0,0,0);
    this.rotation = 0;
}
function HabObjectType(name, collision_limits, operation_limits, collision_limits_offset) {
    this.name = name;
    this.collision_limits = collision_limits;
    this.operation_limits = operation_limits;
    this.collision_limits_offset = collision_limits_offset;
}