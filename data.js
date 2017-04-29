function HabLayout() {
    this.title = ""
    this.rooms = []
    



}


function HabRoom() {
    this.room = null
    this.position = new Point(0,0) 
}
function HabRoomType() {
    this.name = ""
    this.objects = [] 
    this.floor_plan = [] // list of points defining floor plan
}
function HabObject() {
    this.object = null
    this.position = new Point(0,0,0)
    this.rotation = 0 
}
function HabObjectType() {
    this.name = ""
    this.collision_limits = new Point(0, 0, 0);
    this.operation_limits = new Point(0, 0, 0);
    this.collision_limits_offset = new Point(0, 0, 0);
    this.sprite = "";
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