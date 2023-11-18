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
            [[[0,0],[39,0],[39,39]],[[0,0],[0,39],[39,39]]],
            [[radius,0,0],[-radius,0,0],[radius,height,0],[-radius,height,0]],
            [[0,2,3],[3,1,0]],position)
  this.objectID = objectList.length - 1
  this.faceCam = function(){
    var weh = 0
    
    if((450 >mainRho%360 && mainRho%360 > 270) || (90 >mainRho%360 && mainRho%360 > -90)){
        weh = 180
    }
    objectList[this.objectID].vertices = [[radius*Math.cos(-(mainRho+0+weh)/180*Math.PI),0,radius*Math.sin(-(mainRho+0+weh)/180*Math.PI)],
                                         [radius*Math.cos(-(mainRho+180+weh)/180*Math.PI),0,radius*Math.sin(-(mainRho+180+weh)/180*Math.PI)],
                                         [radius*Math.cos(-(mainRho+0+weh)/180*Math.PI),height,radius*Math.sin(-(mainRho+0+weh)/180*Math.PI)],
                                         [radius*Math.cos(-(mainRho+180+weh)/180*Math.PI),height,radius*Math.sin(-(mainRho+180+weh)/180*Math.PI)]] 
  }
}