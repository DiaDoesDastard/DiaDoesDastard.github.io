/*Tilemap holds the 
-objectID 0
-textureURL 1
-primativeID 2
*/
var tilemap = new Array(7,7,3)

//ObjectIDs are not created until runtime, so we will fill in later

//TextureURL must be input before runtime else it will be default

//
var copyA = [0,"cobblestone.png","plane"]
var copyB = [0,"","wall"]
var copyC = [0,"","cube"]

tilemap = [
  [copyA,copyA,copyA,copyC,copyA,copyA,copyA],
  [copyA,copyB,copyB,copyB,copyB,copyB,copyA],
  [copyA,copyB,copyB,copyB,copyB,copyB,copyA],
  [copyA,copyB,copyB,copyB,copyB,copyB,copyA],
  [copyA,copyB,copyB,copyB,copyB,copyB,copyA],
  [copyA,copyB,copyB,copyB,copyB,copyB,copyA],
  [copyA,copyA,copyA,copyC,copyA,copyA,copyA]
]

function loadFromTilemap(lastObjectID){
    for(var tileX = 0; tileX<tilemap.length; tileX++){
      for(var tileY = 0; tileY<tilemap.length[tileX]; tileY++){
        tilemap[tileX,tileY][0] = (lastObjectID+tileY+tileX*tilemap.length)
        generatePrimative(tilemap[tileX,tileY][2],[tileX*2,0,tileY*2],tilemap[tileX,tileY][1])
      }
    }
}


