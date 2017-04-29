//
// routines for creating and manipulating the voxel bucket
//

//var math = require('math.js');

var xmax=10+2; // +2 to give boundary around edge of map
var ymax=15+2;
var zmax=12+2;


// make the bucket array
var bucket=new Array();
for (x=0;x<xmax;x++) {
 bucket[x]=new Array();
 for (y=0;y<ymax;y++) {
  bucket[x][y]=new Array();
  for (z=0;z<zmax;z++) {
   bucket[x][y][z]=new Array();
  }
 }
}

// each voxel is an array (currently)

console.log("bucket currently : "+bucket);
 
