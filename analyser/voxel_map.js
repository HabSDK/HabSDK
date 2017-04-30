//
// routines for creating and manipulating the voxel bucket
//

//var math = require('math.js');

eval(fs.readFileSync('GLOBAL_VARS.js')+'');

var xmax=XGridSize+2; // +2 to give boundary around edge of map
var ymax=YGridSize+2;
var zmax=ZGridSize+2;

//
// make the bucket array 
var bucket=new Array();
for (x=0;x<xmax;x++) {
 bucket[x]=new Array();
 for (y=0;y<ymax;y++) {
  bucket[x][y]=new Array();
  for (z=0;z<zmax;z++) {
   bucket[x][y][z]=0;
   }
 }
}

// each voxel is an array (currently)

//hab_objects=layout.get_objects();

//console.log(hab_objects);

bucket[1][2][3]="test!";
//console.log("bucket currently : "+bucket);

//console.log(hab_objects[0]);

//function update_bucket(x,y,z,hab_object);

var i=0;
var j=0;

console.log("AAA");
console.log(layout.rooms.length);
Dict=layout.room_types;
dn=layout.rooms[i].room_type_name;
console.log(dn)
roompos=layout.rooms[i].position;
room=Dict[dn];
console.log(room);
furn=room.objects[j];
furnpos=furn.position;
furnkey=furn.object_type_name;
console.log(furnkey);
furn_dets=object_types.filter(function(type) { return type.name==furnkey; });
furn_dets=furn_dets[0]; // because above returns a list
furn_size=furn_dets.limits;
furn_data=furn_dets.properties;

console.log("*"+furn_size);


var p=0;
var q=0;
var r=0; // these are indices for filling voxel box

for (p=0;p<furn_size.x;p++) {
	for (q=0;q<furn_size.y;q++) {
		for (r=0;r<furn_size.z;r++) {
		    console.log(furnpos);
			targx=roompos.x+furnpos.x+p;
			targy=roompos.y+furnpos.y+q;
			targz=furnpos.z+r;
			console.log(targx+'/'+targy+'/'+targz+"  ");
			current_data=bucket[targx][targy][targz];
			console.log(current_data);
			if (current_data!=0) console.log("CLASHHHHHHHHHHH!");
			//if (current_data==null) console.log("OK!");
			//console.log(current_data);
			bucket[targx][targy][targz]=furn_data
		}
	}
}

console.log(bucket);
/*
console.log(furn_dets.name);


console.log(Dict);
console.log(dn);
console.log(roompos);

console.log("XXXXX");
console.log(furnpos);
console.log(furn);
console.log("1");
console.log(furnkey);
console.log("2");
console.log(object_types);
console.log("hello");
console.log(furn_dets);
console.log(furn_size);
console.log(furn_data);
*/
// console.log(layout.rooms[0].position.x+" "+layout.rooms[0].position.y+" "+layout.rooms[0].room_type_name+" - "+layout.room_types[layout.rooms[0].room_type_name]);
