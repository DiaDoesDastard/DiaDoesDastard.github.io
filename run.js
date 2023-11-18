start()
setInterval(play,1000/60); 
//play()
var moveCounter = 0
const littleGuy = new spriteHandler("evilwizard1Not.png",[1,-2,1])
const bigGuy = new spriteHandler("wizard1Not.png",[1,-2,1])
const movingBox = generatePrimative("cube",[-1,-2,-1],"SpriteA.png",[.5,.5,.5])
//uuuuu
function start(){
  //loadFromTilemap(0)
  /*
  for(makerX = -4; makerX<4; makerX++){
    generatePrimative("cube",[makerX-.5,-1.5,3.5],"cinderblockNot.png");
  }
  for(makerX = -4; makerX<4; makerX++){
    generatePrimative("cube",[makerX-.5,-1.5,-4.5],"cinderblockNot.png");
  }
  for(makerX = -4; makerX<0; makerX++){
    generatePrimative("cube",[3.5,-1.5,makerX-.5],"cinderblockNot.png");
  }
  for(makerX = 1; makerX<5; makerX++){
    generatePrimative("cube",[3.5,-1.5,makerX-.5],"cinderblockNot.png");
  }
  for(makerX = -4; makerX<4; makerX++){
    generatePrimative("cube",[-4.5,-1.5,makerX-.5],"cinderblockNot.png");
  }
  */
  //for(makerX=-2;makerX<2;makerX++){
    //for(makerY=-2;makerY<2;makerY++){
  /*
      generatePrimative("wall1",[0,-1,0],"cinderblockNot.png")
  generatePrimative("wall2",[0,-1,0],"cinderblockNot.png")
  generatePrimative("wall3",[0,-1,0],"cinderblockNot.png")
  generatePrimative("wall4",[0,-1,0],"cinderblockNot.png")*/
  for(makerX = -2.5; makerX<3; makerX++){
    generatePrimative("wall1",[makerX,-2,-3.5],"cinderblockNot.png",[.5,1,.5]) 
  }
  for(makerX = -2.5; makerX<3; makerX++){
    generatePrimative("wall2",[makerX,-2,3.5],"cinderblockNot.png",[.5,1,.5]) 
  }
  for(makerX = -2.5; makerX<3; makerX++){
    generatePrimative("wall3",[3.5,-2,makerX],"cinderblockNot.png",[.5,1,.5]) 
  }
  for(makerX = -2.5; makerX<3; makerX++){
    generatePrimative("wall4",[-3.5,-2,makerX],"cinderblockNot.png",[.5,1,.5]) 
  }
      generatePrimative("plane",[0,0,0],"cobblestoneNot.png",[3,1,3]);  
  generatePrimative("cube",[0,-2,0],"cobblestonenewnew.png",[.5,.5,.5])
  generatePrimative("wall4",[-3.95,-1.5,0],"doorNot.png",[1,0.5,0.5])
  generatePrimative("wall3",[3.95,-2,0],"cinderblockWITHchainsENDNot.png",[1,1,0.5])
  
    //}
  //}
  

}

function play(){
  moveCounter += .1
  rotationMatrix = generateRotationMatrix(mainRho,mainPhi);
  toCameraVector = [Math.sin(Math.PI * mainRho / 180),
                    Math.sin(Math.PI * mainPhi / 180),
                    Math.cos(Math.PI * mainRho / 180)]
  sunVector = [Math.sin(Math.PI * sunRho / 180),
                    Math.sin(Math.PI * sunPhi / 180),
                    Math.cos(Math.PI * sunRho / 180)]
  littleGuy.faceCam()
  bigGuy.faceCam()
  objectList[movingBox.objectID].position = [-1,-2,2*Math.sin(moveCounter)]
  for(e = 0; e<objectList.length; e++){
    bufferObject(objectList[e], e, rotationMatrix, occlusionMask, offset);
  }  
  renderScreen()
  let imageData = new ImageData(imageArrays,xSize)
  ctx.putImageData(imageData,0,0)
  occlusionMask.fill(-1)
  clearScreen()
}

document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    if(charStr == "a"){
      offset[0] = offset[0]-scaling*Math.sin(Math.PI * mainRho / 180 + Math.PI/2);
      offset[2] = offset[2]-scaling*Math.cos(Math.PI * mainRho / 180 + Math.PI/2);
    }
    if(charStr == "d"){
      offset[0] = offset[0]+scaling*Math.sin(Math.PI * mainRho / 180 + Math.PI/2);
      offset[2] = offset[2]+scaling*Math.cos(Math.PI * mainRho / 180 + Math.PI/2);
    }
    if(charStr == "w"){
      offset[0] = offset[0]+scaling*Math.sin(Math.PI * mainRho / 180);
      offset[2] = offset[2]+scaling*Math.cos(Math.PI * mainRho / 180);
    }
    if(charStr == "s"){
      offset[0] = offset[0]-scaling*Math.sin(Math.PI * mainRho / 180);
      offset[2] = offset[2]-scaling*Math.cos(Math.PI * mainRho / 180);
    }
    if(charStr == "e"){
      mainRho += 1;
    }
    if(charStr == "q"){
      mainRho -= 1;
    }
    if(charStr == "r"){
      scaling += 1;
    }
    if(charStr == "f"){
      scaling -= 1;
    }
  if(charStr == "z"){
    sunRho += 1;
  }
  if(charStr == "c"){
    sunRho -= 1;
  }
  
};