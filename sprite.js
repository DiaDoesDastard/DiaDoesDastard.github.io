function spriteHandler(
  spriteTexture = "",
  position = [0,0,0],
  radius = 1/2,
  height = 1){
  this.spriteTexture = spriteTexture
  this.position = position
  this.radius = radius
  this.height = height
  this.objectID = 0

  gameObject(spriteTexture, 
            [[[0,0],[79,0],[79,79]],[[0,0],[79,0],[79,79]]],
            [[radius,0,0],[-radius,0,0],[radius,height,0],[-radius,height,0]],
            [[2,3,1],[1,0,2]],position)
  this.objectID = objectList.length - 1
  this.faceCam = function(){
    var weh = 1
    
    /*if((450 >mainRho%360 && mainRho%360 > 270) || (90 >mainRho%360 && mainRho%360 > -90)){
        weh = -1
      
    }*/
    objectList[this.objectID].vertices = [[radius*Math.cos(-(mainRho+180+weh)/180*Math.PI),0,radius*Math.sin(-(mainRho+180+weh)/180*Math.PI)],
                                         [radius*Math.cos(-(mainRho+0+weh)/180*Math.PI),0,radius*Math.sin(-(mainRho+0+weh)/180*Math.PI)],
                                         [radius*Math.cos(-(mainRho+180+weh)/180*Math.PI),height,radius*Math.sin(-(mainRho+180+weh)/180*Math.PI)],
                                         [radius*Math.cos(-(mainRho+0+weh)/180*Math.PI),height,radius*Math.sin(-(mainRho+0+weh)/180*Math.PI)]] 
    //console.log(objectList[this.objectID].vertices)
    generateNormals(objectList[this.objectID])
  }
}