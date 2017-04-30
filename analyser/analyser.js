
const fs = require('fs');

var webjs_path = '../web/habSDK/js/'
var webres_path = '../web/habSDK/resources/';
var analyser_path = '../analyser/';
eval(fs.readFileSync(webjs_path+'spatial.js')+'');
eval(fs.readFileSync(webjs_path+'data.js')+'');
eval(fs.readFileSync(analyser_path+'metrics.js')+'');
eval(fs.readFileSync(analyser_path+'rules.js')+'');
eval(fs.readFileSync(analyser_path+'layout_analyser.js')+'');
eval(fs.readFileSync(analyser_path+'object_library.js')+'');

var object_types = load_objecttypes();
function load_objecttypes() {
  return JSON.parse(fs.readFileSync(webres_path+'object_types.json'));
}

function struct_to_layout(map_data_object)
{
  var layout = new HabLayout(map_data_object);
  
  layout.rooms.forEach((value,index) => {
    layout.rooms[index] = new HabRoom(value);
  });

  Object.values(layout.room_types).forEach((value, index) => {
    for(var room_type in layout.room_types) {
      if(layout.room_types.hasOwnProperty(room_type)) {
        layout.room_types[room_type] = new HabRoomType(layout.room_types[room_type]);
        layout.room_types[room_type].objects.forEach((valueb, indexb) => {
          layout.room_types[room_type].objects[indexb] = new HabObject(valueb);
        });
      }
    }
  });

  return layout;
}

module.exports = {
  analyse: analyse,
  struct_to_layout: struct_to_layout,
  reload_objecttypes: load_objecttypes
};
