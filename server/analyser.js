
const fs = require('fs');

var sourcepath = '../analyser/';

eval(fs.readFileSync(sourcepath+'spatial.js')+'');
eval(fs.readFileSync(sourcepath+'metrics.js')+'');
eval(fs.readFileSync(sourcepath+'rules.js')+'');
eval(fs.readFileSync(sourcepath+'layout_analyser.js')+'');
eval(fs.readFileSync(sourcepath+'object_library.js')+'');
eval(fs.readFileSync(sourcepath+'data.js')+'');

function analyse_object(map_data_object)
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

  return analyse(layout);
}

module.exports = {
  analyse: analyse,
  analyse_object: analyse_object
};
